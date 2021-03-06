import { App } from '@slack/bolt';
import fetch from 'cross-fetch';

const url =
  'https://api.openweathermap.org/data/2.5/weather?lat=37.225004&lon=127.187690&appid=3a3faad2ff8d32bd5b413c9dbdc82048';

function weatherApi(app: App) {
  // 현재 학교 날씨
  app.message('자비스 날씨', async ({ message, say }) => {
    await say({
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `이 정도는 직접 찾아보세요;;`,
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '현재 학교날씨',
            },
            action_id: 'button_click_1',
          },
        },
      ],
      // @ts-expect-error
      text: `Hey there <@${message.user}>!`,
    });
  });

  // 버튼 클릭
  app.action('button_click_1', async ({ ack, say }) => {
    await ack();
    // 날씨 api 찌르기 - fetch
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const { weather } = data;
        const [array] = weather;
        const { main } = array;
        // 맑을 때
        if (main === 'Clear') say(`:sunny:`);
        // 구름
        else if (main === 'Cloud') say(`:cloud:`);
        // 눈
        else if (main === 'Snow') say(`:snowflack:`);
        // 비
        else if (main === 'Rain') say(`:umbrella_with_rain_drops:`);
        // 그 밖
        else say(`저도 모르겠어요...:loading:`);
      });
  });
}

export default weatherApi;
