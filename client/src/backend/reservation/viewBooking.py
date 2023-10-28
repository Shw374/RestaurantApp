import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Reservations')

def lambda_handler(event, context):
    try:
        request_body = json.loads(event['body'])
        customer_id = request_body['customer_id']

        response = table.query(
            IndexName='customer_id-index',
            KeyConditionExpression='customer_id = :customer_id',
            ExpressionAttributeValues={
                ':customer_id': customer_id
            }
        )

        if response['Count'] == 0:
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'message': 'No bookings found for the specified customer.',
                    'bookings': []
                })
            }

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
