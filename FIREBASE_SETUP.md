# הפעלת התחברות Google + סנכרון ענן ☁️

האפליקציה עובדת מצוין גם בלי זה — כל הנתונים נשמרים מקומית בכל מכשיר.
כדי לאפשר **התחברות עם Google** ו**סנכרון בין כל המכשירים של המשפחה**, בצעו:

## 1. צרו פרויקט Firebase (חינם)
1. היכנסו ל-https://console.firebase.google.com
2. **Add project** → תנו שם (למשל `austria-trip`) → המשך עד הסוף
3. אין צורך ב-Google Analytics

## 2. הוסיפו אפליקציית Web
1. במסך הפרויקט לחצו על אייקון ה-Web `</>`
2. תנו כינוי (Nickname) → **Register app**
3. תועתק לכם קוביית קוד `firebaseConfig` — שמרו את הערכים:
   `apiKey`, `authDomain`, `projectId`, `appId`

## 3. הפעילו התחברות Google
1. בתפריט הצד: **Build → Authentication → Get started**
2. לשונית **Sign-in method** → בחרו **Google** → **Enable** → Save

## 4. צרו מסד נתונים Firestore
1. **Build → Firestore Database → Create database**
2. בחרו **Start in production mode** → Next → בחרו אזור (למשל `eur3`) → Enable
3. לשונית **Rules** → הדביקו את הכלל הבא ולחצו **Publish**
   (מאפשר קריאה/כתיבה רק למשתמשים מחוברים):
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /trips/{tripId} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

## 5. הרשו את הדומיין של GitHub Pages
1. **Authentication → Settings → Authorized domains → Add domain**
2. הוסיפו: `nettawitztum-alt.github.io`

## 6. הדביקו את ה-config ב-index.html
פתחו את `index.html`, חפשו `FIREBASE_CONFIG` (בראש ה-`<script>`),
ומלאו את הערכים מסעיף 2:
```js
const FIREBASE_CONFIG = {
  apiKey: "AIza...",
  authDomain: "austria-trip.firebaseapp.com",
  projectId: "austria-trip",
  appId: "1:....:web:...."
};
```
שמרו, עשו commit, והעלו לגיט-האב. תוך דקה כפתור **"התחבר עם Google"** יופיע במסך הכניסה,
וכל שינוי (משימות, אטרקציות, עריכות לו"ז, רשימת ציוד) יסונכרן אוטומטית בין כל מי שמחובר. 🎉

> הערה: ערכי ה-config של Firebase אינם סוד — הם מיועדים להיכלל בקוד צד-לקוח.
> האבטחה נשמרת ע"י כללי ה-Firestore (סעיף 4) הדורשים התחברות.
