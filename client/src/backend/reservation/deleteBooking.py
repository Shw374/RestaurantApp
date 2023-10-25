import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Reservations')

def lambda_handler(event, context):
    try:
        # Assuming the reservationId is passed in the event body as JSON
        request_body = json.loads(event['body'])
        reservation_id = request_body['reservationId']

        # Delete the reservation from DynamoDB
        response = table.delete_item(
            Key={
                'restaurantId': request_body['restaurantId'],
                'reservationId': reservation_id
            }
        )

        # Check if the reservation was deleted successfully
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
