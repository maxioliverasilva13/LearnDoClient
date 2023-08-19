import Pusher from "pusher-js";

const appid = "73c7a4829d7d8e48d310";
const cluster = 'us2'

export let pusher = new Pusher(appid, {
  cluster: cluster,
});

export const PUSHER_MESSAGESENT_EVENT_NAME = "createMessage";

export const initPusher = () => {
  if (!pusher) {
    pusher = new Pusher(appid, {
      cluster: cluster,
    });
  }
};

export const formatChannelMessageSendName = (userFormId, userToId) => {
    return `MessageFrom-${userFormId}-To-${userToId}`
}

export const subscribe = (channelName) => {
    const channel = pusher.subscribe(channelName);
    return channel;
}