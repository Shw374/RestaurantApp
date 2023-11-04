import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Reservations')

def lambda_handler(event, context):
    try:
        request_body = json.loads(event['body'])

        reservation_id = request_body['reservationId']

        update_expression = "SET "
        expression_attribute_values = {}
        for key in request_body:
            if key != 'reservationId': 
                update_expression += f"{key} = :{key}, "
                expression_attribute_values[f":{key}"] = request_body[key]

        update_expression = update_expression.rstrip(', ')

        response = table.update_item(
            Key={
                'reservationId': reservation_id
            },
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_attribute_values,
            ConditionExpression="attribute_exists(reservationId)",
            ReturnValues="ALL_NEW"
        )

        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Reservation updated successfully!',
                'updatedReservation': response['Attributes']
            })
        }

    except dynamodb.meta.client.exceptions.ConditionalCheckFailedException:
        return {
            'statusCode': 404,
            'body': json.dumps({
                'message': 'Reservation not found.'
            })
        }

    except Exception as e:
        print(f"Error processing request: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Internal Server Error'})
        }
