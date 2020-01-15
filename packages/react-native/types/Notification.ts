/*
 * Copyright (c) 2016-present Invertase Limited
 */

import { NotificationIOS } from './NotificationIOS';
import {
  AndroidPressAction,
  NativeAndroidChannel,
  NativeAndroidChannelGroup,
  NotificationAndroid,
} from './NotificationAndroid';

/**
 * Interface for building a local notification for both Android & iOS devices.
 *
 * #### Example
 *
 * ```js
 * const notification = {
 *   body: 'Hello World!',
 *   title: 'Welcome',
 *   data: {
 *     user: '123',
 *   },
 *   android: {
 *     color: '#3f51b5',
 *   },
 *   ios: {
 *     alertAction: 'Open App',
 *   },
 * };
 *
 * await notifee.displayNotification(notification);
 * ```
 */
export interface Notification {
  /**
   * The main body content of a notification.
   *
   * #### Example
   *
   * ![Body Text](https://prismic-io.s3.amazonaws.com/invertase%2F7f9cc068-c618-44f0-88da-6041c6d55f48_new+project+%2817%29.jpg)
   *
   * ```js
   * const notification = {
   *   body: 'Hello World!',
   * };
   *
   * await notifee.displayNotification(notification);
   * ```
   */
  body?: string;

  /**
   * A unique identifier for your notification.
   *
   * Defaults to a random string.
   */
  id?: string;

  /**
   * The notification title which appears above the body text.
   *
   * On Android, if you wish to read the title when the notification is opened, add it to the `data` object.
   *
   * #### Example
   *
   * ![Title Text](https://prismic-io.s3.amazonaws.com/invertase%2F6fa1dea9-8cf6-4e9a-b318-8d8f73d568cf_new+project+%2818%29.jpg)
   *
   * ```js
   * const notification = {
   *   title: 'Welcome!',
   *   body: 'Hello World!',
   * };
   *
   * await notifee.displayNotification(notification);
   * ```
   */
  title?: string;

  /**
   * The notification subtitle, which appears on a new line below the title.
   *
   * #### Example
   *
   * ![Title Text](https://prismic-io.s3.amazonaws.com/invertase%2F6fa1dea9-8cf6-4e9a-b318-8d8f73d568cf_new+project+%2818%29.jpg)
   *
   * ```js
   * const notification = {
   *   title: 'Welcome!',
   *   subtitle: 'Learn more...',
   *   body: 'Hello World!',
   * };
   *
   * await notifee.displayNotification(notification);
   * ```
   */
  subtitle?: string;

  /**
   * Additional data to store on the notification. Only `string` values can be stored.
   *
   * #### Example
   *
   * ```js
   * const notification = {
   *   body: 'Hello World!',
   *   data: {
   *     user: '123',
   *   }
   * };
   *
   * await notifee.displayNotification(notification);
   * ```
   */
  data?: { [key: string]: string };
}

/**
 * TODO
 */
export interface NotificationBuilder extends Notification {
  /**
   * Android specific notification options. See the `NotificationAndroid` interface for more
   * information and default options which are applied to a notification.
   *
   * #### Example
   *
   * ```js
   * const notification = {
   *   body: 'Hello World!',
   *   android: {
   *     color: '#3f51b5',
   *   },
   * };
   *
   * await notifee.displayNotification(notification);
   * ```
   *
   * @platform android
   */
  android?: NotificationAndroid;

  /**
   * iOS specific notification options. See the `NotificationIOS` interface for more information
   * and default options which are applied to a notification.
   *
   * #### Example
   *
   * ```js
   * const notification = {
   *   body: 'Hello World!',
   *   ios: {
   *     alertAction: 'Open App',
   *   },
   * };
   *
   * await notifee.displayNotification(notification);
   * ```
   *
   * @platform ios
   */
  ios?: NotificationIOS;
}

/**
 * TODO
 */
export interface RemoteNotification extends Notification {
  /**
   * @platform android
   */
  android: NotificationAndroid;

  /**
   * @platform ios
   */
  ios: NotificationIOS;
}

/**
 * TODO
 */
export type EventObserver = (
  type: EventType,
  event: {} & (
    | AndroidNotificationEvent
    | AndroidChannelBlockedEvent
    | AndroidChannelGroupBlockedEvent
    | AndroidAppBlockedEvent
  ),

  headless: boolean,
) => Promise<void>;

/**
 * An enum representing an event type for `onNotificationEvent` subscriptions.
 */
export enum EventType {
  /**
   * An unknown event was received.
   *
   * This event type is a failsafe to catch any unknown events from the device. Please
   * report an issue with a reproduction so it can be correctly handled.
   */
  UNKNOWN = -1,

  /**
   * Event type is sent when the user dismisses a notification. This is triggered via the user swiping
   * the notification from the notification shade or performing "Clear all" notifications.
   *
   * This event is **not** sent when a notification is cancelled or times out.
   *
   * The payload sent with this event is [AndroidNotificationEvent](/react-native/reference/androidnotificationevent).
   */
  DISMISSED,

  /**
   * Event type is sent when a notification has been pressed by the user.
   *
   * On Android, notifications must include an `android.onPressAction` property for this event to trigger.
   *
   * The payload sent with this event is [AndroidNotificationEvent](/react-native/reference/androidnotificationevent).
   */
  PRESS,

  /**
   * Event type is sent when a user presses a notification action.
   *
   * The event sent with this type is [AndroidNotificationEvent](/react-native/reference/androidnotificationevent).
   */
  ACTION_PRESS,

  /**
   * Event type sent when a notification has been delivered to the device. For scheduled notifications,
   * this event is sent when at the point when the schedule runs, not when a notification is first
   * created.
   *
   * It's important to note even though a notification has been delivered, it may not be shown to the
   * user. For example, they may have notifications disabled on the device/channel/app.
   *
   * The event payload sent with this event is [AndroidNotificationEvent](/react-native/reference/androidnotificationevent).
   */
  DELIVERED,

  /**
   * Event is sent when the user changes the notification blocked state for the entire application or
   * when the user opens the application settings.
   *
   * The payload sent with this event is [AndroidAppBlockedEvent](/react-native/reference/androidappblockedevent).
   *
   * @platform android API Level >= 28
   */
  APP_BLOCKED,

  /**
   * Event type is sent when the user changes the notification blocked state for a channel in the application.
   *
   * The payload sent with this event is [AndroidChannelBlockedEvent](/react-native/reference/androidappblockedevent).
   *
   * @platform android API Level >= 28
   */
  CHANNEL_BLOCKED,

  /**
   * Event type is sent when the user changes the notification blocked state for a channel group in the application.
   *
   * The payload sent with this event is [AndroidChannelGroupBlockedEvent](/react-native/reference/androidchannelgroupblockedevent).
   *
   * @platform android API Level >= 28
   */
  CHANNEL_GROUP_BLOCKED,
}

export interface AndroidNotificationEvent {
  action?: AndroidPressAction;

  /**
   * The input from a notification action.
   *
   * Once an input has been received, the notification should be updated to remove the pending state
   * of the notification action, by adding the input value to the `inputHistory` property.
   *
   * @platform android API Level >= 20
   */
  input?: string;
  notification: RemoteNotification;
}

export interface AndroidChannelBlockedEvent {
  channel: NativeAndroidChannel;
}

export interface AndroidChannelGroupBlockedEvent {
  channelGroup: NativeAndroidChannelGroup;
}

export interface AndroidAppBlockedEvent {
  app: {
    blocked: boolean;
  };
}

/**
 * TODO
 */
export interface NotificationSchedule {
  /**
   * The date when the notification should first be shown, in milliseconds since 1970.
   *
   * #### Example
   *
   * Schedule notification to display 10 minutes from now.
   *
   * ```js
   * await notifee.scheduleNotification(notification, {
   *   fireDate: Date.now() + 600000,
   * });
   * ```
   */
  fireDate: number;

  /**
   * Whether the `fireDate` should be respected exactly.
   *
   * To help save battery, only set to `true` under scenarios where the notification
   * `fireDate` is critical.
   *
   * Defaults to `false`. Has no effect on iOS.
   *
   * @platform android
   */
  exact?: boolean;

  /**
   * How frequently after  the `fireDate` should the notification be repeated.
   *
   * If not present, the notification will only be displayed once on the given `fireDate`.
   *
   * #### Example
   *
   * Schedule notification to display 10 minutes from now, and repeat
   * every week
   *
   * ```js
   * import notifee, { AndroidRepeatInterval } from '@notifee/react-native';
   *
   * await notifee.scheduleNotification(notification, {
   *   fireDate: Date.now() + 600000,
   *   repeatInterval: AndroidRepeatInterval.WEEK,
   * });
   */
  repeatInterval?: NotificationRepeatInterval;
}

/**
 * Interface used when defining the `repeatInterval` on a scheduled notification.
 */
export enum NotificationRepeatInterval {
  MINUTE = 'minute',
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
}
