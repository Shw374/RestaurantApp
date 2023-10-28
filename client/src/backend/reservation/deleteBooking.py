import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Reservations')

def lambda_handler(event, context):
    try:
        request_body = json.loads(event['body'])
        reservation_id = request_body['reservationId']

        response = table.delete_item(
            Key={
                'restaurantId': request_body['restaurantId'],
                'reservationId': reservation_id
            }
        )

        if 'Attributes' in response:
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'message': 'Reservation deleted successfully!',
                    'reservationId': reservation_id
                })
            }
        else:
            return {
                'statusCode': 404,
                'body': json.dumps({
                    'message': 'Reservation not found!'
                })
            }

    except Exception as e:
        print(f"Error processing request: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Internal Server Error'})
        }
