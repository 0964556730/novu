---
sidebar_position: 5
sidebar_label: Get started with Node.js
---

# Node.js Quickstart

Welcome to the Node.js Quickstart guide for Novu, a powerful notification service that enables you to send multi-channel (SMS, Email, Chat, Push) notifications from your Node.js applications. In this Quickstart, you'll learn how to seamlessly integrate Novu into your app and perform various essential tasks. Let's get started!

## **Prerequisites**

Before diving into the Quickstart, make sure you have the following:

- Node.js installed on your development machine.
- A Novu account. If you don't have one, sign up for free at web.novu.co

### **Install and Set Up Novu in your Node.js App**

First, you must install the Novu package in your Node.js application. Open your terminal and run the following command:

```bash
npm install @novu/node
```

Once installed, you can import Novu into your app and initialize it using your Novu account credentials. This step establishes a connection between your app and the Novu notification service.

```jsx
import { Novu } from '@novu/node';

const novu = new Novu('<YOUR_NOVU_API_KEY>');
```

Replace the `<YOUR_NOVU_API_KEY>` value with the authentic key from the **API Key** section of your [Novu Dashboard](https://web.novu.co/settings).

<aside>
🔑 **Note:** Please do not hardcode your credentials in a file in production. Use environment variables instead.

</aside>

## Set Up A Channel Provider

A channel provider is a service that provides one or more notification functionality such as sending an email, SMS, push notification etc. Our [integration store](https://web.novu.co/integrations) includes four channels: Email, SMS, Chat, and Push. These channels have multiple providers associated with them.

| Channel | Providers                                                           |
| ------- | ------------------------------------------------------------------- |
| Email   | MailGun, Mandrill, MailJet, Amazon SES, Sendgrid, Postmark, Netcore |
| SMS     | Twilio, Amazon SNS, Plivo, SMS, SMSCentral, Kannel, Infobip, Termii |
| Chat    | Mattermost, Slack, Microsoft Teams, Discord                         |
| Push    | FCM, APNS, Expo                                                     |

Only one provider can be **active** per **channel**. Connect any of your favorite providers to get started. The email channel comes with Novu's email provider, which is active by default and includes 300 credits.

## Create A Notification Template

A notification template is the blueprint for the notifications that will be sent. It holds the entire flow of messages sent to the subscriber. This is where all the different channels are tied together under a single entity.

The template includes the following:

- Notification template name and Identifier
- Channel tailored content:
  | Channel | Content Style |
  | ------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
  | Email | 1. Custom Code (HTML) with option to use custom variables via the handlebars , {{ }}, syntax. |
  | 2. Click and place UI items with the visual template editor. |
  | SMS | Text with the option to use handlebars syntax, {{ }} to inject custom variables. |
  | Chat | Text with the option to use handlebars syntax, {{ }} to inject custom variables. |
  | In-App | Text |

<aside>
🔑 **Note:** Proper authorization needs to be set for the Chat channel for subscribers.

</aside>

Please proceed to create a notification template.

1. Click “Notifications” on the left sidebar of your Novu dashboard.
2. Click the “Create Workflow” button on the top right.
3. The name of a new notification template is currently "Untitled." Rename it to a more suitable title.
4. Select "Email" as the channel you want to add.

![set-email.png](novu/docs/docs/overview/quickstart/media_assets/set-email.png)

1. Click on the recently added channel, fill the email subject and click “Update”.

![update_email_template.png](novu/docs/docs/overview/quickstart/media_assets/update_email_template.png)

1. Click on the “Test” tab and send a test email to verify your notification template.

![send_test_email.png](novu/docs/docs/overview/quickstart/media_assets/send_test_email.png)

You should get an email within seconds. Yaaay, you have successfully sent your first notification via the Novu dashboard! Now, let’s take it a step further to trigger notifications via code.

## Create A Subscriber

The recipients of a triggered notification are called subscribers.

Click “Subscribers” on the left sidebar of the Novu dashboard to see all subscribers. By default, the dashboard will display a subscriber, as you were added automatically during sign-up.

![subscriber_id.png](novu/docs/docs/overview/quickstart/media_assets/subscriber_id.png)

Now, let's create a subscriber on Novu. Copy and paste the following code to do so:

```jsx
// Create a subscriber
const subscriberId = '7789'; // Replace this with a unique user ID that matches your database.
await novu.subscribers.identify(subscriberId, {
  email: 'abc@gmail.com', // optional
  firstName: 'John', // optional
  lastName: 'Doe', // optional
  phone: '', // optional
  avatar: '', // optional
  locale: '', // optional
  data: { customKey1: 'customVal1', customKey2: 'customVal2' }, // optional
});
```

Run the code in your terminal like so:

```bash
node index.js
```

You should see the subscriber on your Novu dashboard.

![Screenshot 2023-05-14 at 11.06.38.png](novu/docs/docs/overview/quickstart/media_assets/Screenshot_2023-05-14_at_11.06.38.png)

I’d like to publicly announce that `abc@gmail.com` is a random unlikely email your users will have. To update this to an alternative email, you can call the `updateSubscriber` method like so:

```jsx
// Update subscriber detail
await novu.subscribers.update('7789', {
  // new email
  email: 'validemail@gmail.com', // optional
  // new phone
  phone: '+19874567832', // optional
});
```

Other valid fields that can be updated are `phone`, `avatar`, and `data` . The `data` field can accept an array of metadata that you want to attach to the subscriber.

<aside>
🔑  **Note:** To make all of your app users subscribers, you need to programmatically add them to Novu.

</aside>

## Trigger A Notification

Copy and paste the following code into your app to trigger a notification:

```jsx
const notificationTemplateId = 'first-email';

novu.trigger(notificationTemplateId, {
  to: {
    subscriberId: '7789',
  },
  payload: {},
});
```

Before running the code, make sure you understand the following:

- The value of `notificationTemplateId` should be the notification template’s trigger ID/slug.

![trigger_id.png](novu/docs/docs/overview/quickstart/media_assets/trigger_id.png)

- The value of `payload` is an array of the data that you want to be dynamically injected into the notification template content.
- The value of `subscriberId` is the id of the subscriber on Novu. Replace `7789`

with your subscriber ID.

Run the code to trigger a notification!

```bash
node index.js
```

# Topics

Novu provides a simple API that offers an easy interface for triggering notifications to multiple subscribers at once. This API is called "Topics" and allows users to manage their bulk notifications without having to implement complex loops. A topic is identified by a custom key that is provided by the user, and this key will be the identifier used in the Topics API.

<aside>
⚠️ DANGER: The topic key should be unique and can't be changed once chosen. Novu also safe guards for key uniqueness behind the scenes.

</aside>

Users can assign a name to a topic for descriptive purposes. This name does not need to be unique and can be changed using the API.

A topic can have different subscribers, who will receive a notification whenever a notification is sent to the topic.

## **Create a topic[](https://docs.novu.co/platform/topics#create-a-topic)**

Copy and paste the following code into your app to create a topic:

```jsx
const result = await novu.topics.create({
  key: 'unique-topic-identifier',
  name: 'descriptive-topic-name',
});
```

Before running the code, make sure you understand the following:

- When creating a `key`, ensure it is unique and accurately identifies the topic. Document naming conventions and communicate them to team members to avoid confusion and ensure a smooth workflow.
- The value of `name` should be a descriptive topic name.

## Add s**ubscribers to a topic**

Copy and paste the following code into your app to add subscribers a topic:

```jsx
const topicKey = '<YOUR TOPIC KEY>';

const response = await novu.topics.addSubscribers(topicKey, {
  subscribers: ['subscriber-id-1', 'subscriber-id-2', ...],
});
```

- To add multiple subscribers to a topic, simply separate their names with commas and add them to the array as part of the `subscribers` value.

## **Sending a notification to a topic[](https://docs.novu.co/platform/topics#sending-a-notification-to-a-topic)**

Thanks to the topics feature, it is possible to trigger a notification to all subscribers assigned to a topic. This helps avoid listing all subscriber identifiers in the `to` field of the notification trigger.

To trigger a notification to all subscribers of a topic, use Novu's API as follows:

```jsx
const topicKey = '<TOPIC_KEY>';
const notificationTemplateId = '<NOTIFICATION_TEMPLATE_ID>';

await novu.trigger(notificationTemplateId, {
  to: [{ type: 'Topic', topicKey: topicKey }],
  payload: {},
});
```

## **Next Steps**

Great job! If you've reached this point, you should now have successfully created a subscriber, notification template, configured a channel provider, triggered a single notification, created a topic, added a subscriber to a topic and even triggered a notification to a topic in your application.

To learn more about notifications and explore Novu's features and capabilities, check out:

- [Novu Digest Engine](https://docs.novu.co/platform/digest) - Learn how to aggregate multiple trigger events into a single message and deliver it to the subscriber.
- [Novu Notification Center](https://docs.novu.co/notification-center/getting-started) - Learn how to integrate a rich, ready-to-use real-time UI notification center into your app.
