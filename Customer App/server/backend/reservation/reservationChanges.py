from google.cloud import firestore, pubsub_v1
from google.protobuf.timestamp_pb2 import Timestamp
import json

db = firestore.Client()
publisher = pubsub_v1.PublisherClient()

def send_notification(data, event_type):
    reservation_id = data['reservationId']
    restaurant_email = data['restaurantEmail']

    # Define your Pub/Sub topic
    topic_name = 'projects/csci5410f23serverless/topics/reservation-notifications'

    # Create a timestamp for the current time
    current_time = Timestamp()
    current_time.GetCurrentTime()

    # Define the Pub/Sub message payload
    payload = {
        'reservationId': reservation_id,
        'eventType': event_type,
        'timestamp': current_time.ToJsonString(),
    }

    # Define Pub/Sub message attributes
    attributes = {
        'restaurantEmail': restaurant_email,
    }

    # Create Pub/Sub message
    message = {
        'data': json.dumps(payload),
        'attributes': attributes,
    }

    # Publish the message to the topic
    publisher.publish(topic_name, **message)

def on_reservation_change(event, context):
    event_type = context.event_type
    reservation_id = context.resource.split('/')[-1]

    # Get reservation data from Firestore
    reservation_ref = db.collection('reservations').document(reservation_id)
    reservation_data = reservation_ref.get().to_dict()

    if reservation_data:
        reservation_data['reservationId'] = reservation_id
        send_notification(reservation_data, event_type)