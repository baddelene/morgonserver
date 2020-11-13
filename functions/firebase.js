const moment = require('moment');
const fetch = require('node-fetch');

class firebase {

  async getAllUsers(admin) {
    const db = admin.firestore()
    console.log('The DB variable: ', this.db);
    const ref = db.collection("users");
    const snapshot = await ref.get();
    await snapshot.forEach(async (doc) => {
      const user = doc.data()
      const userPushNotificationTime = user.time;
      const isSame = this.isSameTime(userPushNotificationTime);
      console.log('Running check for user: ', doc.id);
      if (isSame.isSame) {
        console.log('Push notification will be sent out to user: ', doc.id);
        //Send push notification
        const data = {
          to: user.expoShareToken.data,
          title: 'Hej från Morgon appen!',
          body: 'Ett nytt kort väntar på dig :) '
        }

        try {
          await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
              'Content-Type': 'application/json'
            }
          });

          //Update users time to receive notififcation.
          const ref = db.collection("users").doc(doc.id)
          const res = await ref.update({ time: isSame.newPush })

        } catch (error) {
          console.log('Something went wrong with the push notification: ', error);
        }
      }

    })

  }

  /**
   * Is the time for the push notification the same time as now.
   * @returns true.
   */
  isSameTime(setPushNotificationTime) {
    const now = moment(Date.now()).add(1, "hour").seconds(0).milliseconds(0).toISOString();
    const userTime = moment.unix(setPushNotificationTime).seconds(0).milliseconds(0).toISOString();
    const isSame = moment(now).isSame(userTime);
    if (isSame) {
      return {
        isSame,
        newPush: moment(userTime).add(1, "day").unix()
      }
    }
    return {
      isSame,
      newPush: null
    }
  }
}

module.exports = firebase;