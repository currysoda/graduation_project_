var express = require('express');
var app = express();

var bodyParser = require(`body-parser`);
var fs = require(`fs`);
var compression = require('compression');
var cookie_parser = require(`cookie-parser`);
var path = require(`path`);
var LocalStrategy = require(`passport-local`);

var helmet = require(`helmet`);
app.use(helmet()); // 기본 보안

var session = require(`express-session`);
var FileStore = require(`session-file-store`)(session);

app.locals.pretty = true; // html 편하게 보기

app.set('view engine', `pug`); // 템플릿 엔진 페이지 생성하기 위해 있는 것 ?
app.set(`views`, `./views`); //
app.engine(`html`, require(`pug`).renderFile);

// app.use(express.static(path.join(__dirname,`public`)));

// __dirname == 현재 파일 경로
// 정적 파일 서비스
// 경로가 OS에 따라 다르게 표현되도 지장 없도록
app.use('/public', express.static(path.join(__dirname, 'public'))); 

app.use(express.urlencoded({ extend : true}));
app.use(express.json());

app.use(cookie_parser());
app.use(compression()); // 압축 전송

const fileStoreOptions = {

};

app.use(session({
    store : new FileStore(fileStoreOptions),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    // passport는 session을 이용 session은 cookie 기반 작동
    // http 에서 cookie secure : true 설정시 쿠키를 전달하지 않음
    // https 일 경우에만 cookie secure : ture시에도 쿠키 전달
    // 프로그램은 http 환경에서 개발되므로 cookie secure : false를 사용
    // 상용 프로그램에서는 절대 중요정보를 cookie secure : false에서 전달 금지
    // reverse proxy server 사용시 전달
    cookie: {   
                secure: false,
                maxAge: 1000 * 60 * 60
            }
}));

var passport = require(`./lib/passport`) (app);

app.use(passport.initialize());
app.use(passport.authenticate(`session`));
app.use(passport.session());

// 라우터

var registerRouter = require(`./routers/account_register`) (app);
app.use(`/account_register`, registerRouter);

var authRouter = require(`./routers/loginpage`) (app, passport);
app.use(`/loginpage`, authRouter);

var companyRouter = require(`./routers/mainpage`) (app);
app.use(`/mainpage`, companyRouter);

var logout = require(`./routers/logout`) ();
app.use(`/logout`, logout);

app.get('/',(req,res) => {
    res.status(200).render(`enterence.pug`);
});

// 에러
app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!")
});

// 실행
app.listen(3000,() => {
    console.log("connected 3000 port!");
});