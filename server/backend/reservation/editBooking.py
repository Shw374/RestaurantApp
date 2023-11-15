import json
import boto3
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Reservations')
ARN = "arn:aws:execute-api:us-east-1:728932281340:wyz7695tcf/*/POST/updatetable"

# {
#   "body": "{\"reservationId\": \"res12345\", \"customer_id\": \"cust123\", \"restaurantId\": \"rest123\", \"start_time\": \"6am\", \"end_time\": \"7am\"}"
# }

def find_conflicts(restaurantId, start_time, end_time, exclude_reservation_id=None):
    response = table.query(
        IndexName='restaurantId-startTime-index',  
        KeyConditionExpression='restaurantId = :restaurantId AND startTime BETWEEN :start_time AND :end_time',
        ExpressionAttributeValues={
            ':restaurantId': restaurantId,
            ':start_time': start_time,
            ':end_time': end_time
        }
    )
    conflicts = []
    for item in response['Items']:
        if exclude_reservation_id and item['reservationId'] == exclude_reservation_id:
            continue
        conflicts.append(item['tableNumber'])
    return conflicts

def assign_new_table(restaurantId, start_time, end_time, exclude_reservation_id):
    conflicts = find_conflicts(restaurantId, start_time, end_time, exclude_reservation_id)
    for table_number in range(1, 21):
        if table_number not in conflicts:
            return table_number
    return None

def lambda_handler(event, context):
    try:
        request_body = json.loads(event['body'])
        reservation_id = request_body['reservationId']
        customer_id = request_body['customer_id']
        restaurantId = request_body['restaurantId']
        start_time = request_body['start_time']
        end_time = request_body['end_time']

        response = table.get_item(
            Key={
                'reservationId': reservation_id
            }
        )
        reservation = response.get('Item')
        if not reservation:
            return {
                'statusCode': 404,
                'body': json.dumps({
                    'message': 'Reservation not found.'
                })
            }
        
        new_table_number = assign_new_table(restaurantId, start_time, end_time, reservation_id)
        if not new_table_number:
            return {
                'statusCode': 409,
                'body': json.dumps({
                    'message': 'No available tables for the selected time slot.'
                })
            }

        reservation['customer_id'] = customer_id
        reservation['start_time'] = start_time
        reservation['end_time'] = end_time
        reservation['tableNumber'] = new_table_number

        table.put_item(Item=reservation)

        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Reservation updated successfully!',
                'reservation': reservation
            })
        }

    except Exception as e:
        print(f"Error processing request: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Internal Server Error'})
        }

