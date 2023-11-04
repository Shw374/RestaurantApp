import json
import boto3
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Reservations')

def lambda_handler(event, context):
    try:
        request_body = json.loads(event['body'])

        slot = request_body['slot']
        res_availability = request_body['res_availability']
        customer_id = request_body['customer_id']
        order_id = request_body['order_id']
        start_time = request_body['start_time']
        restaurantId = request_body['restaurantId']
        end_time = request_body['end_time']
        isCancelled = request_body['isCancelled']
        reservationDate = request_body['reservationDate']

        response = table.query(
            IndexName='restaurantId-reservationDate-index',
            KeyConditionExpression='restaurantId = :restaurantId AND reservationDate BETWEEN :start_time AND :end_time',
            ExpressionAttributeValues={
                ':restaurantId': restaurantId,
                ':start_time': start_time,
                ':end_time': end_time
            }
        )

        if response['Count'] > 0:
            return {
                'statusCode': 409,
                'body': json.dumps({
                    'message': 'The desired reservation time is already booked.'
                })
            }

        reservation_id = str(int(datetime.utcnow().timestamp() * 1000)) 
        table.put_item(
            Item={
                'reservationId': reservation_id,
                'slot': slot,
                'res_availability': res_availability,
                'customer_id': customer_id,
                'order_id': order_id,
                'start_time': start_time,
                'restaurantId': restaurantId,
                'end_time': end_time,
                'isCancelled': isCancelled,
                'reservationDate': reservationDate
            }
        )

        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Reservation successful!',
                'reservationId': reservation_id
            })
        }

    except Exception as e:
        print(f"Error processing request: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Internal Server Error'})
        }
