import json
import boto3
import uuid
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Reservations')

ARN = "arn:aws:execute-api:us-east-1:728932281340:1tjt8xvt44/*/POST/createreservations"
# {
#   "body": "{\"customer_id\": \"customer123\", \"restaurantId\": \"restaurant456\", \"start_time\": \"2023-11-06T19:00:00Z\", \"end_time\": \"2023-11-06T21:00:00Z\"}"
# }

def customer_has_conflict(restaurantId, customer_id, start_time, end_time):
    response = table.scan(
        FilterExpression='restaurantId = :restaurantId AND customer_id = :customer_id AND start_time <= :end_time AND end_time >= :start_time',
        ExpressionAttributeValues={
            ':restaurantId': restaurantId,
            ':customer_id': customer_id,
            ':start_time': start_time,
            ':end_time': end_time
        }
    )
    return 'Items' in response and len(response['Items']) > 0

def assign_table(restaurantId, start_time, end_time):
    response = table.query(
        IndexName='restaurantId-startTime-index',
        KeyConditionExpression='restaurantId = :restaurantId AND startTime BETWEEN :start_time AND :end_time',
        ExpressionAttributeValues={
            ':restaurantId': restaurantId,
            ':start_time': start_time,
            ':end_time': end_time
        }
    )
    
    reserved_tables = [item['tableNumber'] for item in response['Items']]
    
    for i in range(1, 21):
        if i not in reserved_tables:
            return i
    return None

def lambda_handler(event, context):
    try:
        request_body = json.loads(event['body'])

        slot = request_body['slot']
        res_availability = request_body['res_availability']
        customer_id = request_body['customer_id']
        start_time = request_body['start_time']
        restaurantId = request_body['restaurantId']
        end_time = request_body['end_time']
        isCancelled = request_body['isCancelled']
        reservationDate = request_body['reservationDate']

        reservation_id = str(uuid.uuid4())
        order_id = str(uuid.uuid4())

        if customer_has_conflict(restaurantId, customer_id, start_time, end_time):
            return {
                'statusCode': 409,
                'body': json.dumps({
                    'message': 'Customer already has a booking for the selected time slot.'
                })
            }

        tableNumber = assign_table(restaurantId, start_time, end_time)
        if not tableNumber:
            return {
                'statusCode': 409,
                'body': json.dumps({
                    'message': 'No available tables for the selected time slot.'
                })
            }

        table.put_item(
            Item={
                'reservationId': reservation_id,
                'customer_id': customer_id,
                'restaurantId': restaurantId,
                'start_time': start_time,
                'end_time': end_time,
                'tableNumber': tableNumber,
                'order_id': order_id,
                'isCancelled': isCancelled,
                'slot': slot,
                'reservationDate': reservationDate,
                'res_availability': res_availability
            }
        )

        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Reservation successful!',
                'reservationId': reservation_id,
                'orderId': order_id,
                'tableNumber': tableNumber
            })
        }

    except Exception as e:
        print(f"Error processing request: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Internal Server Error'})
        }

