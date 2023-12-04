import boto3
import json
from datetime import datetime, timedelta

sns_topic_arn = 'arn:aws:sns:us-east-1:248274840893:restaurant-change'

# Maintain a list to track opened restaurants
opened_restaurants = []

# Maintain a dictionary to track offers for each restaurant
offers_for_restaurants = {}

def lambda_handler(event, context):
    global opened_restaurants
    global offers_for_restaurants

    dynamodb = boto3.resource('dynamodb')
    sns = boto3.client('sns', region_name='us-east-1')

    for record in event['Records']:
        if record['eventName'] == 'MODIFY':
            new_image = record['dynamodb']['NewImage']
            old_image = record['dynamodb']['OldImage']

            new_status = new_image.get('status', {}).get('S')
            old_status = old_image.get('status', {}).get('S')

            # Check if the restaurant is newly opened
            if new_status == 'open' and old_status != 'open':
                restaurant_name = new_image.get('restaurant_name', {}).get('S')
                opening_time = datetime.now().isoformat()

                # Add the opened restaurant to the list
                opened_restaurants.append({'name': restaurant_name, 'opening_time': opening_time})

                # Send notification about the opening
                send_notification(sns, f"Restaurant {restaurant_name} is now open!")

            new_offers = new_image.get('menu', {}).get('M', {}).get('entire_menu_offer', {}).get('N')
            old_offers = old_image.get('menu', {}).get('M', {}).get('entire_menu_offer', {}).get('N')

            # Check if there's a new offer
            if new_offers is not None and old_offers is not None and new_offers != old_offers:
                restaurant_name = new_image.get('restaurant_name', {}).get('S')
                offer_time = datetime.now().isoformat()

                # Add the offer to the dictionary
                if restaurant_name not in offers_for_restaurants:
                    offers_for_restaurants[restaurant_name] = []

                offers_for_restaurants[restaurant_name].append({'offer': new_offers, 'offer_time': offer_time})

                # Send notification about the new offer
                send_notification(sns, f"New offer available at {restaurant_name}: {new_offers}% off on the entire menu")

    # Clean up the list by removing restaurants opened more than an hour ago
    opened_restaurants = [r for r in opened_restaurants if datetime.now() - datetime.fromisoformat(r['opening_time']) < timedelta(hours=1)]

    # Clean up the dictionary by removing offers older than an hour for each restaurant
    for restaurant_name, offers in offers_for_restaurants.items():
        offers_for_restaurants[restaurant_name] = [o for o in offers if datetime.now() - datetime.fromisoformat(o['offer_time']) < timedelta(hours=1)]

def send_notification(sns, message):
    try:
        response = sns.publish(
            TopicArn=sns_topic_arn,
            Message=message,
            Subject='Restaurant Change Notification'
        )
        print(f"Notification sent successfully: {json.dumps(response)}")
    except Exception as e:
        print(f"Error sending notification: {str(e)}")

