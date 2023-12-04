import boto3
import json

sns_topic_arn = "arn:aws:sns:us-east-1:248274840893:restaurant-change"

def send_sns(message, subject):
    sns_client = boto3.client("sns")
    sns_client.publish(TopicArn=sns_topic_arn, Message=message, Subject=subject)

def lambda_handler(event, context):
    for record in event['Records']:
        # Making sure the record is modified.
        if record['eventName'] == ['MODIFY']:
            # Extracting menu item and its respective description
            old_menu_item_name = record['dynamodb'].get('OldImage', {}).get('name', {}).get('S')
            new_menu_item_name = record['dynamodb'].get('NewImage', {}).get('name', {}).get('S')
            description = record['dynamodb'].get('NewImage', {}).get('description', {}).get('S', '')

            # Checking if menu item name has changed
            if old_menu_item_name and new_menu_item_name and old_menu_item_name != new_menu_item_name:
                subject = 'Menu Items Changed'
                message = f'Menu Item: {old_menu_item_name} has been changed to {new_menu_item_name}.\n Description: {description}'

                # Sending SNS notification
                send_sns(message, subject)

    return "Processing Complete"
