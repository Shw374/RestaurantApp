import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Reservations')
ARN = "arn:aws:execute-api:us-east-1:728932281340:6izmkuake8/*/POST/deletebooking"
# {
#   "body": "{\"reservationId\": \"1234567890123\"}"
# }

def lambda_handler(event, context):
    try:
        request_body = json.loads(event['body'])

        reservation_id = request_body['reservationId']

        response = table.delete_item(
            Key={
                'reservationId': reservation_id
            }
        )

        if 'Attributes' not in response:
            return {
                'statusCode': 404,
                'body': json.dumps({
                    'message': 'Reservation not found.'
                })
            }

        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Reservation deleted successfully!'
            })
        }

    except Exception as e:
        print(f"Error processing request: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Internal Server Error'})
        }
