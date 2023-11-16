import json
import boto3
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Reservations')
ARN = "arn:aws:execute-api:us-east-1:728932281340:fl3d9hzy6a/*/POST/viewbookings"
# {
#   "queryStringParameters": {
#     "reservationId": "1699366043259"
#   }
# }

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

def lambda_handler(event, context):
    try:
        reservation_id = event.get('queryStringParameters', {}).get('reservationId')

        if not reservation_id:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'reservationId query parameter is required.'})
            }

        response = table.get_item(
            Key={
                'reservationId': reservation_id
            }
        )

        if 'Item' not in response:
            return {
                'statusCode': 404,
                'body': json.dumps({'message': 'Reservation not found.'})
            }

        return {
            'statusCode': 200,
            'body': json.dumps(response['Item'], cls=DecimalEncoder)
        }

    except Exception as e:
        print(f"Error processing request: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Internal Server Error'})
        }
