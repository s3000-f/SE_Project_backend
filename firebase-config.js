var admin = require("firebase-admin");
const key = {
    "type": "service_account",
    "project_id": "se-uni",
    "private_key_id": "6669d896a560fc9394fda70db813efb35f51010b",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCli9KccbOMXPKj\n1AiGseAgxaOMLsma8qoIo+1kuDYKJavQC1gGu9WmWR+nLuX9gQPl3AaYUX5m8FUj\nFaNMtj6L/6KrcCztuxLX8Fna3wZ8HlgcfTHAnGHmg6687thZBdGTTno9Wor56gFU\nSMh+DyYtXzhxfilvAwGz3rQL+JLDokCkk9SO4cxfUeXHNWvzLG+yf4zHEqDNdTV/\nYPrm14tJ5Qc4iDoZXbIx2Ab7cSrHtjmX1Cd9p3xOHTvzoxnnY5BLMUT+roxmHR+2\n18ddCIivYfX5+MTiAvGqLskNlpKatg/1HFWL+epxBn3nYf3KApz1m6/2kHwUMW5+\nPqrX/bebAgMBAAECggEAN7ZMHUE4myLGt7LKYcYn9u98gFdYmtBSv9CnOk+yRAz0\nevHuYGnDV5XDzMhAN2W9UZSQFZ/Laco05LdJ+y2T9BqGfKqmPCVKjKiDHOEUth2i\nKohJf5hBbEnhuwyoe6E1LB1rjw1TGxMQ+nP6IU5o2zkh7jP2rrj00DtBHYw8nCCK\njEBcWIS5HMZfXWyNHYzQTlhn0t8YwkW06YCMwXJ6rWuGrpUVWT34VTUyq2aQiUf+\nZnoaJeE6+SZ0pnR8h+ThSigJLRGMuP5GNoyZX8W8jFAs3mpAqd7jpTKV99/yL88J\n26hTO2k11B6JmyOj0g051/dP/4P4hvuGt+vuJorSQQKBgQDQu/6aRjYXKFs5bAs2\nYvfHsEXeKZdFbAzBkfA+0cjFv5Rdv7zrD6X4R5Vb0haKgG5SAP3co4qQCqbmE8P7\n2D6oKhEmA36zDMdaB81q0/KxqNPl7TIpZvSJ9H0VmSZXgwOu9Q5acIxJoiRJnMZJ\nsoIBLMvh30klTpOjJSEsa+FrWwKBgQDLCEbxTMjegEkiWC7OIChUy7Fa3enoN2/s\n+DNY/5lqstm3nSOACg5voiyd111av31BJljV9o0/EGRUUfezjdAzsmbYTHUDIktX\nQYqb5+V/n6rLPfiUqnh4bz4F3Bos2oBriwA40zcnQURkSlySsi2FPEV45Z49nTeh\n2/ROJhXYwQKBgQCHGPX7ge/mYx9P9gb3x2xZmVRPKxoWO42yBzO4ZO0OWCW926h5\ndyJTpHkd+cbPE7rTZoLoOA0pl0tYZHiXWumKy9dXhDGPz3iDY8NnHhDZPc0P5spt\nk444b745qWrwfwJ2TXNhw7B4w/G6lzabYmbUPdsjsPHVrJrPn+ttpdE7OwKBgB79\nNW7RLHuhkwgV85bsm5tNt9VJt9EE3SWLQLMd2DnL8KUw6+E4J7nsQ+kXnR0jyydt\nhfOqfSaaBuZD2I3kYFnzqfTrvpRq4JsB2vku7P2MzlHVNKLkXhzrxci5LpmYBC/l\n+HOz8WAheyHfo7+USJRkfaoVShDXdU1UODbRY1ZBAoGBALEfzjNwmY145WfG53BI\nSvzUjR10y/Bd2Wnofbk05omcOmjwrc2hCzZp8mC9+4ij7fT02xBvi14JROmSvn0r\nOuyIESBxExHVRFGDpqICvpbsC9tUr9fJw4ugFtPwNoIvSl1/GSbpNa7WnXo+Fw+C\nUWbVM7fY2kIbRSbTx9PJVtI0\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-3bvir@se-uni.iam.gserviceaccount.com",
    "client_id": "109719398656955385249",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-3bvir%40se-uni.iam.gserviceaccount.com"
}

admin.initializeApp({
    credential: admin.credential.cert(key),
    databaseURL: 'https://se-uni.firebaseio.com'
});
exports.admin = admin;
