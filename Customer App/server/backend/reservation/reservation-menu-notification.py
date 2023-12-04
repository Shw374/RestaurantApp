from google.cloud import pubsub_v1, firestore
from google.protobuf.timestamp_pb2 import Timestamp
from datetime import datetime, timedelta
import json

db = firestore.Client()
publisher = pubsub_v1.PublisherClient()

def send_notification(event, context):
    # Get reservation data from the event
    reservation_data = event['value']['fields']
    reservation_id = context.resource.split('/')[-1]

    # Check if there's a menu attached
    has_menu = 'menu' in reservation_data and reservation_data['menu']['arrayValue']['values']

    # Calculate notification time based on menu availability
    notification_time = reservation_data['reservationDate']['timestampValue'] - timedelta(hours=1) if has_menu else reservation_data['reservationDate']['timestampValue'] - timedelta(minutes=10)

    # Schedule notification
    schedule_notification(reservation_id, notification_time, has_menu)

def schedule_notification(reservation_id, notification_time, has_menu):
    # Define your Pub/Sub topic
    topic_name = 'projects/csci5410f23serverless/topics/reservation-notifications'

    # Create a timestamp for the notification time
    notification_timestamp = Timestamp()
    notification_timestamp.FromDatetime(notification_time)

    # Define the Pub/Sub message payload
    payload = {
        'reservationId': reservation_id,
        'hasMenu': has_menu,
    }

    # Schedule the notification using Pub/Sub
    message = {
        'data': json.dumps(payload),
        'attributes': {
            'notification-time': notification_timestamp,
        },
    }

    # Publish the message to the topic
    publisher.publish(topic_name, **message)