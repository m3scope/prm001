$('.input-form-email,#walletemail,input-form-one-section').on('keyup', function() {
    $(this).val($(this).val().replace(/[^0-9a-zA-Z-@\.!#$%&*+=?_{|}~]/ig,'').toLowerCase());
});
$('.input-form-pass').on('keyup', function() {
    $(this).val($(this).val().replace(/[^0-9a-zA-Z]/ig,''));
});
$('.input-form-promo').on('keyup', function() {
    $(this).val($(this).val().replace(/[^0-9a-z]/ig,''));
});

function ValidMailLogin(idt,idm,idp) {
    const validmail = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;

    let myType = idt;
    let myMail = $(idm).val();
    let myPass = $(idp).val();
    let valid = validmail.test(myMail);
    let output= '';

    let stopvalid;
    if(valid){
        //чтобы при регистрации с главной страницы не проходила запись кошелька
        stopvalid=0;

        output= parseInt(login(myType,myMail,myPass,$.cookie('multisms_referal'),$('#formreg .input-form-promo').val()));

        if(output==112) {output='Ошибка в заполнении почты и/или пароля!';}

        //Зарегистрировались
        if(output==2) {
            $('.out-account').removeClass('active');
            $('.block-recovery,.block-form-registration,.block-change-pass').fadeOut(0);
            $('.in-account').addClass('active');
            setTimeout(function(){notyview('Логин и пароль высланы на почту: '+myMail+'<br><br>Ожидайте до 15 минут и проверьте папку СПАМ');}, 3000);

            //отслеживание регистрации в счетчиках
            setTimeout(function(){
                metrikaReach('reg');
            }, 1000);

            //осуществляем вход
            output=1;
        }
        //Вошли
        if(output==1 || output==110) {
            if(output==110){
                urls.push('/admin1988');
                titles.push('Заказ выплат');

                urls.push('/log1988');
                titles.push('Лог платежей');
            }

            $('.block-recovery,.block-form-registration,.block-change-pass').fadeOut(0);
            $('.out-account').removeClass('active');
            $('.in-account').addClass('active');
            if(window.location.href.indexOf('/reviews')<0)setLocation('/settings');
            //checkbalance();
            //paramining();
            output = 'Вход выполнен!';

            $('.block-exit').attr('title',$('#loginmail').val());
        }
        if(output==4) {output='Ошибка в логине или пароле!<br><br>При регистрации пароль отправляется на почту.<br><br>Пароль можно сменить на кнопку круговой стрелочки.<br><br>После 10-ой неудачной попытки войти, аккаунт блокируется до следующих суток.';}
        if(output==41) {output='Ваш аккаунт заблокирован на сутки!<br><br>Запросите смену пароля по инструкции в разделе Вопросов и зайдите под новым паролем завтра.';}
        if(output==5) {
            output='Пользователь с почтой '+myMail+' уже существует!<br><br>Пароль можно сменить и отправить по почте, нажав на кнопку круговой стрелочки после кнопки ВХОД.';
            stopvalid=1;
        }
        //Заменили пароль
        if(output==3) {
            $('.block-change-pass').fadeOut(0);
            $('.out-account').addClass('active');
            $('.out-account').fadeIn(300);
            output='Пароль выслан на почту: '+myMail+'<br><br>Ожидайте до 15 минут и проверьте папку СПАМ';
        }
        if(output==6) {output='Пользователь с почтой '+myMail+' не существует!';}
    } else output = 'Адрес электронной почты введен неправильно!';

    if(output && output!=1){
        notyview(output);
    }

    if(stopvalid!=1) return valid;
}

function login(t,l,p,c,promocode) {
    const type_from_t=t;
    let timezone= new Date().getTimezoneOffset();
    const login_from_l=l;
    const password_from_p=p;
    const cash_from_c=c;
    const promocode_from_c=promocode;

    let res='';
    $.ajax({
        async: false,
        url: "/login",
        type: "POST",
        data: {t: type_from_t, l: login_from_l, p: password_from_p, c: cash_from_c, promocode: promocode_from_c, timezone: timezone},
        cache: false,
        success: function(data){
            res = data;
        }
    });
    return res;
}
function logout() {
    $.ajax({
        async: false,
        url: "/php/logout.php",
        cache: false,
        success: function(data){
            $('.in-account').removeClass('active');
            $('.out-account').addClass('active');
            $('.out-account').fadeIn(300);
            setLocation('/');
            notyview('Выход выполнен!');

            $('.balance').html("0.00");
            $('.walletbalance,#walletbalance').html("0.00");
            $('.paramining').html("0.0000");
            $('.paraminingpercent').html("0.00");
            $('.balancestructure').html("0.00");

            //отключаем проверку баланса
            window.clearTimeout(checkbalancetimeout);
        }
    });
}
