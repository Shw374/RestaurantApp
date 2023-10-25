import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Reservations')

def lambda_handler(event, context):
    try:
        # Assuming event['body'] contains the customer_id for which bookings need to be fetched
        request_body = json.loads(event['body'])
        customer_id = request_body['customer_id']

        # Query DynamoDB using the GSI
        response = table.query(
            IndexName='customer_id-index',  # Using the GSI for querying based on customer_id
            KeyConditionExpression='customer_id = :customer_id',
            ExpressionAttributeValues={
                ':customer_id': customer_id
            }
        )

        # If there are no bookings, return an appropriate message
        if response['Count'] == 0:
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'message': 'No bookings found for the specified customer.',
                    'bookings': []
                })
            }

        # Return the found bookings
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Bookings fetched successfully.',
                'bookings': response['Items']
            })
        }

    except Exception as e:
        print(f"Error processing request: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Internal Server Error'})
        }
