<html>
<head>
  <link rel="stylesheet" href="styles.css">
    <link href='http://fonts.googleapis.com/css?family=Roboto:400,300,500,700&subset=latin,cyrillic-ext' rel='stylesheet' type='text/css'>
  <script type="text/javascript" src="//vk.com/js/api/openapi.js?96"></script>
  <meta charset="utf-8">
</head>
<body ng-app="vk" ng-controller="HandikaCtrl" ng-class="{'b-body_step1': step == 1}">
  <div id="wrapper"  ng-show="user_loaded" ng-load="load()" ng-cloak>
    <div class="b-shadow" ng-show="showStatistics || secondTime || showRules"></div>
    <div id="step1" ng-show="step == 1" class="b-step b-step_first">
      <h1 class="b-title_first">Handika Box</h1>
      <p class="b-description b-description_first">
        Комплимент подписчикам Хандики к&nbsp;Новому Году&nbsp;&mdash; шанс выиграть коробку<br />наполненную вашими пожеланиями. Каждый день мы&nbsp;принимаем от&nbsp;вас заявки,<br />а в&nbsp;день окончания конкурса мы&nbsp;определим счастливчика, которому мы&nbsp;вышлем<br />заботливо упакованную коробку с&nbsp;выбранными авторскими товарами.&nbsp;Приступим?
      </p>
      <button class="b-button b-button_big b-button_first" ng-click="createBox()">Собрать свою коробку</button>
    </div>
    <div id="step2" ng-show="step==2" class="b-step b-step_second">
      <h1 class="h1_big">Собери свою коробку</h1>
      <p class="b-balls">{{current_user.first_name}}, у тебя {{allBalls | thousands}} баллов, вперёд!</p>
      <ul class="b-photos">
        <li ng-repeat="photo in photos"
            class="b-item b-item-{{$index % 3}}"
            ng-class="{'b-item_selected': photo.selected, 'b-item_not-available': !photo.selected && photo.price > $parent.allBalls, 'b-item_available': photo.selected || photo.price <= $parent.allBalls}"
            title="{{(!photo.selected && photo.price > $parent.allBalls) && 'Недостаточно баллов' || 'Добавить в коробку'}}">
          <div class="photo-wrap">
            <div class="photo-wrap-inner">
              <div class="b-price">{{photo.price}}</div>
              <img ng-src="{{photo.item.src_big}}" class="b-photo" ng-click="changeSelection(photo)">
              <div class="b-selected-item">В коробке</div>
            </div>
            <p class="b-photo-description">{{photo.description}}</p>
            <button class="b-button b-button_want" ng-click="changeSelection(photo)">{{buttonCaption(photo)}}</button>
            <div class="b-master">
              <div class="b-master-title">Приз предоставлен:</div>
              <div class="b-master-avatar">
                <a ng-href="{{photo.master.link}}" title="{{photo.master.name}}"><img ng-src="{{photo.master.avatar}}"></a>
              </div>
              <div class="b-master-name">
                <a ng-href="{{photo.master.link}}" class="b-master-link" title="{{photo.master.name}}">{{photo.master.name}}</a>
              </div>
            </div>
          </div>
          <div class="not-available-message">
            ;-(<br />Недостаточно</br />баллов
          </div>
        </li>
      </ul>
      <div class="finish-selection">
        <div class="b-center">
          <p ng-class="hasSelected && 'invisible'" class="b-hint">Чтобы продолжить, положи что-нибудь в коробку.</p>
          <img src="images/loader.gif" alt="" ng-show="requestStarted">
        </div>
        <button class="b-button b-button_big" ng-click="next()" ng-hide="requestStarted" ng-disabled="!hasSelected">Далее</button>
      </div>

    </div>
    <div id="step3" ng-show="step==3" class="b-step b-step_third">
      <h1 class="h1_big">Отличный выбор!</h1>
      <a href="" class="backlink" ng-click="start()">Собрать коробку</a>
      <div class="b-fuck-yeah">
        Превратите свои желания в реальность и получите настоящую коробку<br />с выбранными призами. Для этого: подпишитесь на сообщество Handika,<br />опубликуйте картинку со своими пожеланиями себе на стену и набирайте как<br />можно больше отметок «Мне нравится». Продолжим?
      </div>
      <ol class="b-next-steps">
        <li class="b-next-step" ng-class="subscribed && 'b-next-step_done'">
          <!-- VK Widget -->
          <div id="vk_subscribe"></div>
          <script type="text/javascript">
          VK.Widgets.Subscribe("vk_subscribe", {}, -48475446);
          </script>
        </li>
        <li class="b-next-step b-next-step_post" ng-click="post()" ng-class="{'b-next-step_disabled': !subscribed}">
          <div class="b-post-image">Запостить картинку</div>
        </li>
      </ol>
      <div class="b-result-image">
        <img ng-src="{{result.src_big}}" alt="" id="result-src" class="b-result">
      </div>
    </div>
    <div id="step4" ng-show="step==4" class="b-step b-step_finish">
      <h1 class="h1_big">Финиш</h1>
      <p class="b-fuck-yeah">Теперь мы опубликуем картинку с набором ваших товаров в альбоме конкурса, а<br />вам останется только рассказать о своей коробке друзьям. Победа тем ближе,<br />чем большему числу людей понравится ваш набор. Не абывайте, что конкурс только<br /> для подписчиков паблика <a href="http://vk.com/handika">Handika</a>.</p>
      <button class="b-button b-button_big" ng-click="start(); showStatistics = true;">Смотреть участников</button>
    </div>
    <div ng-show="showRules" class="b-popup b-popup_rules">
      <span role="link" ng-click="showRules = false" class="close">&times;</span>
      <h1 class="h1_stat">Правила конкурса</h1>
      <div class="rules" hand-scrollable="500" hand-scrollable-var="showRules">
        <p>1. Конкурс — соревнование между физическими лицами зарегистрированных в социальной сети ВКонтакте. Конкурс проводится на странице проекта Handika в социальной сети ВКонтакте — http://vk.com/handika среди подписчиков проекта.</p>
        <p>2. Конкурс проводится в срок с 15 ноября 2013, 11:00 (мск) по 15 декабря 2013, 21:00. Результаты конкурса объявляются 16 декабря 2013 года до 11:00</p>
        <p>3. Задание Конкурса: Участникам, выполнившим условия п.1 и п.2 настоящих Правил, предлагается сформировать список желаемых призов из перечня, предлагаемых в конкурсе, после чего поделиться сообщением с этим списком, разместив его на свою личную страницу в социальной сети ВКонтакте. После этого участники могут призывать пользователей социальной сети ВКонтакте ставить отметку «мне нравится» и делиться с другими сообщением участника на своих страницах.</p>
        <p>4. Определение Победителей. В сроки, указанные в п. 2 Правил, Организатор определяет победителей с учетом соблюдения требований, указанных в п. 3 настоящих правил. Победителем признается физическое лицо, отвечающее требованиям конкурса и набравшее максимальное количество отметок «мне нравится» и перепостов от других пользователей ВКонтакте.</p>
        <p>Итоги Конкурса и имена Победителей публикуются на Странице в сроки, указанные в п. 2 настоящих Правил. Организатор уведомляет Участников Конкурса о присуждении им Приза путем публикации соответствующего информационного сообщения на Странице. По итогам конкурса выявляется не более 3 (трех) победителей.</p>
        <p>6. Призовой фонд Конкурса (далее — Призы):</p>
        <p>7. Вручение Призов осуществляется Организатором путем отправки призов с помощью курьерской службы (например, EMS) на адрес, указанный Победителем.</p>
        <p>7.2. Согласно настоящим Правилам выплата денежного эквивалента стоимости вручаемого Приза не производится.</p>
        <p>7.3. В случае отказа Победителя Конкурса от получения Приза, Победитель Конкурса теряет право требования Приза от Организатора Конкурса.</p>
        <p>7.4. С момента получения Приза Участник Конкурса несет риски его случайной утери или порчи.</p>
      </div>
    </div>
    <div class="b-popup b-popup_second-time" ng-show="secondTime">
      <span role="link" ng-click="secondTime = false" class="close">&times;</span>
      <h1 class="h1_stat">Вы уже участвуете :)</h1>
      <div class="second-time-text">
        Если мы не ошибаемся — вы уже участвовали в конкурсе. Мы не устанавливаем ограничений, принять участие можно несколько раз, но ваши достиженияне складываются, т.е. количество отметок «Мне нравится» у каждого поста будет подсчитано отдельно, а каждый ваш пост это новая заявка.
      </div>
      <button class="b-button b-button_big" ng-click="secondTime = false; start()">Собрать еще одну коробку</button>
    </div>
    <div ng-show="showStatistics" class="b-popup b-popup_statistics" id="statPopup">
      <span role="link" ng-click="showStatistics = false" class="close">&times;</span>
      <h1 class="h1_stat">Участники</h1>
      <div class="b-tooltip" ng-show="row" ng-style="{left: tooltipLeft, top: tooltipTop}">
        <div class="b-likes-line">
          Лайки друзей:
          <span class="b-likes-count">{{row.friends_likes}}</span>
          <span class="b-likes-mult">&times;</span>
          <span class="b-likes-digit">5</span>
          <span class="b-likes-eq">=</span>
          <span class="b-likes-points">{{row.friends_likes * 5}}</span>
        </div>
        <div class="b-likes-line">
          Лайки:
          <span class="b-likes-count">{{row.likes * 5}}</span>
          <span class="b-likes-mult">&times;</span>
          <span class="b-likes-digit b-likes-digit_float">0,1</span>
          <span class="b-likes-eq">=</span>
          <span class="b-likes-points">{{row.likes * 0.1}}</span>
        </div>
      </div>
      <table cellspacing="0" cellpadding="0" class="stats"
             ng-hide="isAdmin" hand-scrollable="200"  hand-scrollable-var="showStatistics"
             ng-mousemove="setCursor($event)">
        <tr ng-repeat="stat in statistics | filter: {user_id: current_user.uid}"
            ng-class="{'stat-row_my': $index == 0, 'stat-row_small': $index != 0, 'stat-row_not-exists': !stat.exists}"
            ng-mouseover="$parent.row = stat"
            ng-mouseout="$parent.row = false"
            >
            <td class="stat-number">{{statistics.indexOf(stat) + 1}}</td>
            <td class="stat-photo"><img ng-src="{{stat.user_photo}}"></td>
            <td class="stat-name"><a href="http://vk.com/id{{stat.user_id}}" target="_blank">{{stat.user_first_name}} {{stat.user_last_name}}</a></td>
            <td class="stat-post"><a href="http://vk.com/id{{stat.user_id}}?w=wall{{stat.user_id}}_{{stat.post_id}}" target="_blank">Пост</a></td>
            <td class="stat-likes">
              <span>{{stat.points}}</span>
            </td>
        </tr>
      </table>
      <div class="members-count" ng-hide="isAdmin">
        <span class="count-span">{{statistics.length | pluralize : ['участник', 'участника', 'участников']}}</span>
      </div>
      <table id="stats" cellspacing="0" cellpadding="0"
             class="stats" hand-scrollable="400"  hand-scrollable-var="showStatistics" style="margin-bottom: 20px;"
             ng-mousemove="setCursor($event)">
        <tr ng-repeat="stat in statistics"
            ng-class="{'stat-row_my': stat.user_id == current_user.uid, 'stat-row_not-exists': !stat.exists}"
            ng-mouseover="$parent.row = stat"
            ng-mouseout="$parent.row = false"
            >
          <td class="stat-number">{{$index + (statPage - 1) * perPage + 1}}</td>
          <td class="stat-photo"><img ng-src="{{stat.user_photo}}"></td>
          <td class="stat-name"><a href="http://vk.com/id{{stat.user_id}}" target="_blank">{{stat.user_first_name}} {{stat.user_last_name}}</a></td>
          <td class="stat-post"><a href="http://vk.com/id{{stat.user_id}}?w=wall{{stat.user_id}}_{{stat.post_id}}" target="_blank">Пост</a></td>
          <td class="stat-likes">
            <span>{{stat.points}}</span>
          </td>
        </tr>
      </table>
    </div>
    <div class="b-statistics-link">
      <a href="" ng-click="showRules = true" class="b-center">Правила</a>
      <span class="gray">&nbsp;•&nbsp;</span>
      <a href="" ng-click="showStatistics = true" class="b-center" >Участники</a>
    </div>
  </div>
  <script src="http://vk.com/js/api/xd_connection.js?2" type="text/javascript"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
  <script src="js/angular.js"></script>
  <script src="js/app.js"></script>
  <script src="js/vk.service.js"></script>
  <script src="js/hand_scrollable.js"></script>
  <script src="js/handika_ctrl.js"></script>
  <script src="js/filters.js"></script>
</body>
</html>