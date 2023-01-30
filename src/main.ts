import {rq, writeCookieFile, readToken} from './request'


async function main() {
    let token = readToken();
    if (token == '') {
        const {data,status,headers} = await rq({
            url: 'http://www.xxxx.xx',
            method: 'post',
            headers:{'token': token},
            data: {
                "username": "xxxxxx",
                "password": "xxxxx"
            },
          });
          console.log('cookie:', headers['set-cookie'])
          console.log('token:', data['data']['token'])

          token = data['data']['token']
    
          if (status==200) {
            writeCookieFile({
                cookie: headers['set-cookie'],
                token: data['data']['token']
            })
          }
    }

}


main()