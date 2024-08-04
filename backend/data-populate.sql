INSERT INTO
  public.users (
    "firstname",
    "lastname",
    "email",
    "contactemail",
    "password",
    "country",
    "phone",
    "address",
    "emailconfirmid",
    "passwordrecoverid",
    "passwordrecovertime",
    "emailconfirmed",
    "roles",
    "createdAt",
    "updatedAt"
  )
VALUES
  (
    'admin_name',
    'admin_lastname',
    'admin@admin.com',
    'admin@admin.com',
    '377b70656100361e49528c17a8ec867a',
    'UA',
    NULL,
    NULL,
    '123',
    NULL,
    NULL,
    true,
    '{user,seller,admin}',
    '2023-01-20T17:55:47.442Z',
    '2023-01-20T17:55:47.442Z'
  ),
  (
    'Serhii',
    'Alishchuk',
    'salischuk@gmail.com',
    'salischuk@gmail.com',
    '377b70656100361e49528c17a8ec867a',
    'UA',
    NULL,
    NULL,
    '123',
    NULL,
    NULL,
    true,
    '{user,seller,admin}',
    '2023-01-20T17:55:47.442Z',
    '2023-01-20T17:55:47.442Z'
  );

INSERT INTO
  public.categories (id, parentid, name, nameen, path, index, leaf)
VALUES
  (
    1,
    NULL,
    'Всі Категорії',
    'All Categories',
    NULL,
    0,
    false
  );

INSERT INTO
  public.sids ("userId")
VALUES
  (1),
  (2);

INSERT INTO
  public.articles (
    "id",
    "title",
    "body",
    "tags",
    "authorId",
    "lastEditorId",
    "createdAt",
    "updatedAt"
  )
VALUES
  (
    1,
    'Article 1',
    'Arcicle Body for 1',
    '{1,2,3}',
    3,
    3,
    '2023-01-20T17:55:47.442Z',
    '2023-03-20T17:55:47.442Z'
  ),
  (
    2,
    'Article 2',
    'Arcicle Body for 2',
    '{1,2}',
    3,
    3,
    '2023-02-20T17:55:47.442Z',
    '2023-01-20T17:55:47.442Z'
  ),
  (
    3,
    'Article 3',
    'Arcicle Body for 3',
    '{3}',
    3,
    3,
    '2023-03-20T17:55:47.442Z',
    '2023-04-20T17:55:47.442Z'
  );

INSERT INTO
  public.articles_tags ("id", "name", "index")
VALUES
  (1, 'my tag1', 1),
  (2, 'my tag2', 2),
  (3, 'my tag3', 3),
  (4, 'my tag4', 4);

INSERT INTO
  public.email_templates (
    "id",
    "name",
    "subject",
    "body",
    "params",
    "index"
  )
VALUES
  (
    1,
    'RecoveryPassword_en',
    'Reset your password at WIZEX.PRO',
    E'Hello, <b>{{username}}</b>!\n<br/><br />\nTo reset your password, you need to enter the code below in the appropriate form on <a href="{{url}}">WIZEX.PRO</a>\n<br /><br />\n<p>\n<span style="border: 1px gray solid; border-radius: 5px; font-size: 26px; color: green; padding: 8px;">{{code}}</span>\n</p>\n<br />\nSincerely and thank you,<br />\n<span style="color: #556cd6; font-size: 15px; font-weight: bold;">Wizex Team</span>\n<br />\n<a href="{{url}}">WIZEX.PRO</a>\n\n',
    E'{\n  "username": "Jhon Benson",\n  "code": "AGMDBN",\n  "url": "http://localhost:3000"\n}',
    1
  ),
  (
    2,
    'RecoveryPassword_uk',
    'Скинути свій пароль на WIZEX.PRO',
    E'Вітаємо, <b>{{username}}</b>!\n<br/><br />\nЩоб скинути пароль, вам необхідно ввести наведений нижче код у відповідну форму на <a href="{{url}}">WIZEX.PRO</a>\n<br /><br />\n<p>\n<span style="border: 1px gray solid; border-radius: 5px; font-size: 26px; color: green; padding: 8px;">{{code}}</span>\n</p>\n<br />\nЗ повагою,<br />\n<span style="color: #556cd6; font-size: 15px; font-weight: bold;">Wizex Team</span>\n<br />\n<a href="{{url}}">WIZEX.PRO</a>',
    E'{\n  "username": "Jhon Benson",\n  "code": "AGMDBN",\n  "url": "http://localhost:3000"\n}',
    2
  ),
  (
    3,
    'Welcome_en',
    'Success registration on WIZEX.PRO',
    E'Congratulations <b>{{username}}</b>!\n<br /><br />\n<div>You have successfully registered on WIZEX.PRO. After authorization, you will be prompted to enter the code you see below. This is required to verify your email.</div>\n<br />\n<p>\n<span style="border: 1px gray solid; border-radius: 5px; font-size: 26px; color: green; padding: 8px;">{{code}}</span>\n</p>\n<br />\nSincerely and thank you,<br />\n<span style="color: #556cd6; font-size: 15px; font-weight: bold;">Wizex Team</span>\n<br />\n<a href="{{url}}">WIZEX.PRO</a>\n\n\n',
    E'{\n  "username": "Jhon",\n  "code": "ASDFAS-23234-ASDF",\n  "url": "http://localhost:3000"\n}',
    3
  ),
  (
    4,
    'Welcome_uk',
    'Успішна реєстрація на WIZEX.PRO',
    E'Вітаємо <b>{{username}}</b>!\n<br /><br />\n<div>Ви успішно зареєструвалися на wizex.pro. Після авторизації вам буде запропоновано ввести код, який ви бачите\n  нижче. Це потрібно для підтвердження електронної пошти.</div>\n<br />\n<p><span\n    style="border: 1px gray solid; border-radius: 5px; font-size: 26px; color: green; padding: 8px;">{{code}}</span>\n</p>\n<br />\nЗ повагою,<br />\n<span\n  style="color: #556cd6; font-size: 15px; font-weight: bold;">Wizex Team</span><br /><a href="{{url}}">wizex.pro</a>\n\n',
    E'{\n  "username": "Jhon",\n  "code": "ASDFAS-23234-ASDF",\n  "url": "http://localhost:3000"\n}',
    4
  ),
  (
    5,
    'ConfirmEmail_en',
    'Confirm your email | WIZEX.PRO',
    E'Hello, <b>{{username}}</b>!\n<br/><br />\nYou entered this email address on WIZEX.PRO\nTo confirm that this is your e-mail, enter this verification code in the corresponding request.\n<br /><br />\n<p>\n<span style="border: 1px gray solid; border-radius: 5px; font-size: 26px; color: green; padding: 8px;">{{code}}</span>\n</p>\n<br />\nSincerely and thank you,<br />\n<span style="color: #556cd6; font-size: 15px; font-weight: bold;">Wizex Team</span>\n<br />\n<a href="{{url}}">WIZEX.PRO</a>\n\n',
    E'{\n  "username": "Jhon",\n  "code": "ASDFAS-23234-ASDF",\n  "url": "http://localhost:3000"\n}',
    5
  ),
  (
    6,
    'ConfirmEmail_uk',
    'Підтвердіть свою електронну адресу | WIZEX.PRO',
    E'Вітаємо, <b>{{username}}</b>!\n<br/><br />\nВи ввели цю електронну адресу на WIZEX.PRO\nЩоб підтвердити, що це ваш e-mail, введіть цей код підтвердження у відповідному запиті.\n<br /><br />\n<p>\n<span style="border: 1px gray solid; border-radius: 5px; font-size: 26px; color: green; padding: 8px;">{{code}}</span>\n</p>\n<br />\nЗ повагою,<br />\n<span style="color: #556cd6; font-size: 15px; font-weight: bold;">Wizex Team</span>\n<br />\n<a href="{{url}}">WIZEX.PRO</a>',
    E'{\n  "username": "Jhon",\n  "code": "ASDFAS-23234-ASDF",\n  "url": "http://localhost:3000"\n}',
    6
  ),
  (
    7,
    'PasswordHasBeenChanged_en',
    'The password has been changed on WIZEX.PRO',
    E'Hello, <b>{{username}}</b>!\n<br/><br />\nYour account password has been successfully changed.\n<br />\n<br />\nSincerely and thank you,<br />\n<span style="color: #556cd6; font-size: 15px; font-weight: bold;">Wizex Team</span>\n<br />\n<a href="{{url}}">WIZEX.PRO</a>\n',
    E'{\n  "username": "Jhon",\n  "url": "http://localhost:3000"\n}',
    7
  ),
  (
    8,
    'PasswordHasBeenChanged_uk',
    'Пароль змінено на WIZEX.PRO',
    E'Вітаємо, <b>{{username}}</b>!\n<br/><br />\nПароль вашого облікового запису успішно змінено.\n<br />\n<br />\nЗ повагою,<br />\n<span style="color: #556cd6; font-size: 15px; font-weight: bold;">Wizex Team</span>\n<br />\n<a href="{{url}}">WIZEX.PRO</a>',
    E'{\n  "username": "Jhon",\n  "url": "http://localhost:3000"\n}',
    8
  ),
  (
    9,
    'EmailChanged_en',
    'Your account email address has been changed | WIZEX.PRO',
    E'Hello, <b>{{username}}</b>!\n<br/><br />\nYour account email address has been changed to {{email}}.\n<br />\n<br />\nSincerely and thank you,<br />\n<span style="color: #556cd6; font-size: 15px; font-weight: bold;">Wizex Team</span>\n<br />\n<a href="{{url}}">WIZEX.PRO</a>',
    E'{\n  "username": "Jhon",\n  "email": "jhon@example.com",\n  "url": "http://localhost:3000"\n}',
    9
  ),
  (
    10,
    'EmailChanged_uk',
    'Адресу електронної пошти вашого облікового запису було змінено | WIZEX.PRO',
    E'Вітаємо, <b>{{username}}</b>!\n<br/><br />\nЕлектронну адресу вашого облікового запису було змінено на {{email}}.\n<br />\n<br />\nЗ повагою,<br />\n<span style="color: #556cd6; font-size: 15px; font-weight: bold;">Wizex Team</span>\n<br />\n<a href="{{url}}">WIZEX.PRO</a>',
    E'{\n  "username": "Jhon",\n  "email": "jhon@example.com",\n  "url": "http://localhost:3000"\n}',
    10
  ),
  (
    11,
    'FirstTariffActivated_en',
    'The tariff plan is activated',
    E'<div style="padding: 3px;">Hello, <b>{{username}}</b>!</div>\n<div style="padding: 0">\n  <span style="font-size: 12px; border-radius: 3px; background-color: #ededed; padding: 3px">Shop: <b>{{shopnameFull}}</b></span>\n</div>\n<br /><br />\n<div>The {{#if program}}<b>ROYAL</b>{{/if}} tariff plan "Up to {{tariff}} product items for UAH {{price}} per month" has been activated.</div>\n<br />\n{{#if promocodeGeneratedMessage}}\n{{promocodeGeneratedMessage}}<br /><br />\n{{/if}}\n{{#if program}}\nGo to the link to the page with promotional codes and invite your friends and partners to also become a member of the <b>{{program}}</b> program: <a\n  href="{{sellerPromocodesLink}}" style="white-space: nowrap;">Go to the Promocodes Page</a>\n<br /></br>\n{{/if}}\n<br />Sincerely and thank you,<br />\n<span style="color: #556cd6; font-size: 15px; font-weight: bold;">Wizex Team</span>\n<br />\n<a href="{{url}}">WIZEX.PRO</a>',
    E'{\n  "username": "Bob Dilan",\n  "shopnameFull": "McBooster",\n  "program": "ROYAL",\n  "promocodeGeneratedMessage": "5 promo codes have been generated...",\n  "sellerPromocodesLink": "http://192.168.0.108:3000/en/admin/promocodes",\n  "tariff": 5,\n  "price": 2.5,\n  "url": "http://192.168.0.108:3000"\n}',
    11
  ),
  (
    12,
    'FirstTariffActivated_uk',
    'Тарифний план активовано',
    E'<div style="padding: 3px;">Вітаємо, <b>{{username}}</b>!</div>\n<div style="padding: 0">\n  <span style="font-size: 12px; border-radius: 3px; background-color: #ededed; padding: 3px">Магазин: <b>{{shopnameFull}}</b></span>\n</div>\n<br /><br />\n<div>Тарифний план {{#if program}}<b>ROYAL</b>{{/if}} "До {{tariff}} товарів на місяць за {{price}} гривень" активовано.</div>\n<br />\n{{#if promocodeGeneratedMessage}}\n{{promocodeGeneratedMessage}}<br /><br />\n{{/if}}\n{{#if program}}\nПерейдіть за посиланням на сторінку з промокодами та запросіть своїх друзів і партнерів також стати учасником програми <b>{{program}}</b>: <a\n  href="{{sellerPromocodesLink}}" style="white-space: nowrap;">Перейти на сторінку промокодів</a>\n<br /></br>\n{{/if}}\n<br />З повагою,<br />\n<span style="color: #556cd6; font-size: 15px; font-weight: bold;">Wizex Team</span>\n<br />\n<a href="{{url}}">WIZEX.PRO</a>',
    E'{\n  "username": "Bob Dilan",\n  "shopnameFull": "McBooster",\n  "program": "ROYAL",\n  "promocodeGeneratedMessage": "5 promo codes have been generated...",\n  "sellerPromocodesLink": "http://192.168.0.108:3000/en/admin/promocodes",\n  "tariff": 5,\n  "price": 2.5,\n  "url": "http://192.168.0.108:3000"\n}',
    12
  ),
  (
    13,
    'Promocode_ROYAL_uk',
    'Промокод для створення магазину на WIZEX.PRO',
    E'<div style="padding: 3px;"><b>Вітаємо !</b></div>\n<p>Ми пропонуємо Вам створити власний магазин і отримати спеціальні умови для розміщення ваших товарних пропозицій на <a href="{{url}}">WIZEX.PRO</a></p>\n<p>Скориставшись наведеним нижче промокодом, ви станете учасником програми ROYAL, яка діятиме протягом наступних 6 місяців. Це програма лояльності, яка допоможе\n  нам покращити наш сервіс і допоможе Вам знайти покупців для ваших товарів чи послуг.</p>\n\n<div>\n\n  <span style="margin-right: 22px;">Промокод:</span>\n  <span style="border: 1px gray solid; border-radius: 5px; font-size: 26px; color: green; padding: 8px;">{{code}}</span>\n</div>\n<br />\n\n<h3 style="font-size: 17px; font-weight: bold;margin:4px 0; padding:0">Коротка інструкція:</h3>\n<div>1. Зареєструйтеся на <a href="{{url}}">WIZEX.PRO</a></div>\n<div>2. У меню виберіть «Мій обліковий запис» і натисніть кнопку «СТАТИ ПРОДАВЦЕМ НА ALIOKS»</div>\n<div>3. Заповніть коротку форму - введіть назву магазину, логотип і промокод, вказаний вище.</div>\n<div>4. Виберіть тарифний план і додайте продукти.</div>\n\n<h3 style="font-size: 17px; font-weight: bold;margin:16px 4px 0; padding:0">Переваги програми <b>ROYAL</b>:</h3>\n<div>- коштує дуже мало. Наприклад, щоб розмістити 10 товарних позицій на місяць, потрібно лише 5 грн (стандартна ціна значно вища)</div>\n<div>- всі кошти, які надійдуть на баланс, будуть автоматично зараховані на бонусний рахунок і повернуться на ваш баланс після закінчення програми</div>\n<div>- Ваш бонусний рахунок буде автоматично поповнюватися коштами за Вашу активність, а саме - за додавання відгуків про товари, відгуків про продавців,\n  активну позицію для залучення нових продавців і т.д.<div>\n\n    <h3 style="font-size: 17px; font-weight: bold;margin:16px 4px 0; padding:0">Хочемо звернути Вашу увагу:</h3>\n    Кількість продавців, які отримають спеціальні умови за програмою ROYAL обмежена.\n\n    <br /><br />\n\n  Бажаємо успішних продажів!\n  <br />\n\n  <br />З повагою,<br />\n  <span style="color: #556cd6; font-size: 15px; font-weight: bold;">Wizex Team</span>\n  <br />\n  <a href="{{url}}">WIZEX.PRO</a>',
    E'{\n  "code": "SADF4FDS",\n  "url": "http://192.168.0.108:3000"\n}',
    13
  ),
  (
    14,
    'Promocode_ROYAL_en',
    'Promo code for creating a Store on WIZEX.PRO',
    E'<div style="padding: 3px;"><b>Hello !</b></div>\n<p>We offer you to create your own Store and get special conditions for placing your product offers on <a href="{{url}}">WIZEX.PRO</a></p>\n<p>By using the promo code below, you will become a member of the ROYAL program, valid for the next 6 months. This is a loyalty program that will help us\n  improve our service and help you find buyers for your goods or services.</p>\n\n<div>\n  <span style="margin-right: 22px;">Promo code:</span>\n  <span style="border: 1px gray solid; border-radius: 5px; font-size: 26px; color: green; padding: 8px;">{{code}}</span>\n</div>\n<br />\n\n<h3 style="font-size: 17px; font-weight: bold;margin:4px 0; padding:0">Brief instructions:</h3>\n<div>1. Register at <a href="{{url}}">WIZEX.PRO</a></div>\n<div>2. In the menu, select «My Account» and click the button «BECOME A SELLER ON ALIOKS»</div>\n<div>3. Fill out the short form - enter the name of the store, the logo and the promotional code indicated above.</div>\n<div>4. Choose a tariff plan and add products.</div>\n\n<h3 style="font-size: 17px; font-weight: bold;margin:16px 4px 0; padding:0">Advantages of the <b>ROYAL</b> program:</h3>\n<div>- costs very little. For example, to place 10 product items per month, you only need 5 UAH (the standard price is much higher)</div>\n<div>- all funds received on the balance will be automatically credited to the bonus account and returned to your balance after the end of the program</div>\n<div>- Your bonus account will be automatically replenished with funds for your activity, namely, for adding reviews about products, reviews about sellers, an\n  active position to attract new sellers, etc.<div>\n\n    <h3 style="font-size: 17px; font-weight: bold;margin:16px 4px 0; padding:0">We want to draw your attention:</h3>\n    The number of sellers who will receive special conditions under the ROYAL program is limited.\n\n    <br /><br /r>\n\n  We wish you successful sales!\n  <br />\n\n  <br />Sincerely and thank you,<br />\n  <span style="color: #556cd6; font-size: 15px; font-weight: bold;">Wizex Team</span>\n  <br />\n  <a href="{{url}}">WIZEX.PRO</a>',
    E'{\n  "code": "SADF4FDS",\n  "url": "http://192.168.0.108:3000"\n}',
    14
  );

INSERT INTO
  public.projects (
    id,
    name,
    "ownerId",
    description,
    "publicLink",
    "apiKey",
    "token",
    "active"
  )
VALUES
  (
    1,
    'ALIOKS',
    2,
    'Alioks Project',
    'https://WIZEX.PRO',
    '93ba9215-67eb-4f3e-b916-915571684d9c',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwicGkiOjEsImFwaUtleSI6IjkzYmE5MjE1LTY3ZWItNGYzZS1iOTE2LTkxNTU3MTY4NGQ5YyIsImlhdCI6MTcyMDg0OTQ0NiwiZXhwIjoxNzIzNDQxNDQ2fQ.MbWtr4aILCnmYEJocvIbAsgrXXIcTas-0kD5xuEXYdA',
    false
  ),
  (
    2,
    'LM',
    2,
    'Leroy Merlin',
    'https://uat.leroymerlin.ua',
    '5c4d52b7-24b7-49d4-aaf5-32924364238b',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwicGkiOjIsImFwaUtleSI6IjVjNGQ1MmI3LTI0YjctNDlkNC1hYWY1LTMyOTI0MzY0MjM4YiIsImlhdCI6MTcyMDc5OTQ0MSwiZXhwIjoxNzIzMzkxNDQxfQ.Qc48O9Eek4JW0pkGB4QNEX_aacgNoH6E_QbzhAX9KDs',
    true
  );

SELECT
  setval (
    '"email_templates_id_seq"',
    (
      SELECT
        max("id")
      FROM
        public.email_templates
    )
  );

INSERT INTO
  public.project_actions (id, "projectId", "level", "message", "content")
VALUES
  (
    1,
    1,
    'error',
    'Add/edit product: Error from backend side: "CODE 123, Problem load image"',
    '{"body": {"message": "Add/edit product: Error from backend side"}, "headers": {}}'
  );

INSERT INTO
  public.system_variables (
    "id",
    "name",
    "description",
    "type",
    "value_STRING",
    "value_JSON",
    "index"
  )
VALUES
  (
    1,
    'price_for_one_product',
    'Price for one product per month',
    'STRING',
    '0.5',
    '{}',
    1
  ),
  (
    2,
    'tariffs_royal',
    'Tariffs for ROYAL program',
    'JSON',
    '',
    '{"5":2.5,"10":5,"20":10,"30":15,"40":20,"50":25,"100":50,"200":100}',
    2
  ),
  (
    3,
    'tariffs_standart',
    'Standart Tariffs',
    'JSON',
    '',
    '{"10000":7,"0":0}',
    3
  ),
  (
    4,
    'tariffs_invitation',
    'Tariffs for INVITATION program',
    'JSON',
    '',
    '{"5":48,"10":95,"20":190,"30":285,"40":380,"50":475,"100":950,"200":1900}',
    4
  ),
  (
    5,
    'emoji',
    'Emoji list',
    'JSON',
    '',
    '["👍","👌","🔥","🙏🏻","💗","😀","🤔","😠"]',
    5
  );

INSERT INTO
  public.payment_accounts (
    "id",
    "userId",
    "tariff",
    "tariff_valid_until",
    "balance"
  )
VALUES
  (1, 1, 10000, '2030-01-01', 0.00),
  (2, 2, 10000, '2030-01-01', 0.00);

SELECT
  setval (
    'categories_id_seq',
    (
      SELECT
        max(id)
      FROM
        public.categories
    )
  );

SELECT
  setval (
    '"users_id_seq"',
    (
      SELECT
        max("id")
      FROM
        public.users
    )
  );

SELECT
  setval (
    '"sids_id_seq"',
    (
      SELECT
        max("id")
      FROM
        public.sids
    )
  );

SELECT
  setval (
    '"projects_id_seq"',
    (
      SELECT
        max("id")
      FROM
        public.projects
    )
  );

SELECT
  setval (
    '"project_actions_id_seq"',
    (
      SELECT
        max("id")
      FROM
        public.project_actions
    )
  );

SELECT
  setval (
    '"system_variables_id_seq"',
    (
      SELECT
        max("id")
      FROM
        public.system_variables
    )
  );

  SELECT
  setval (
    '"payment_accounts_id_seq"',
    (
      SELECT
        max("id")
      FROM
        public.payment_accounts
    )
  );
