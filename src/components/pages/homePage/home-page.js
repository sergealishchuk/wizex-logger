import { useState, useEffect } from 'react';
import { ActiveProjects } from "./components";
import { useRouter } from 'next/router';
import User from '~/components/User';
import { ProjectDescriptionStyled } from './home-page.styled'
import { userService } from '~/http/services';
import { Observer } from '~/utils';
import hljs from 'highlight.js';
import javascript from 'highlight.js/lib/languages/javascript';
import { FlexContainer, SmallButton } from '~/components/StyledComponents';
hljs.registerLanguage('javascript', javascript);


const CodeMonitorTitle = <span><b>Wizex CodeMonitor</b></span>;
const CodeMonitor = <span><b>CodeMonitor</b></span>;

const getPromotionContent = (props) => {
  const { locale, freeTrial } = props;

  const handleGotoRegistration = () => {
    Observer.send('OpenSignInDialog', { action: 'registration' }, () => {
      // const { cb } = offerAuthParams;
      console.log('wow');
      // if (cb && _.isFunction(cb)) {
      //   //cb({ action: 'signin' });

      // }
      // handleClose();
    });
  };

  const handleGotoFree = async () => {
    console.log('try free');
    const startTrialPeriodRequest = await userService.startTrialPeriod();
    console.log('startTrialPeriodRequest', startTrialPeriodRequest);
  };

  return (
    <div>{
      locale === 'en'
        ? <div>
          <p>
            Welcome to {CodeMonitorTitle}, an innovative web platform designed to streamline the debugging and monitoring processes for developers. {CodeMonitor} provides a user-friendly interface where developers can create an account and manage their web projects effortlessly.
          </p>
          <div>
            {!User.userIsLoggedIn()
              ? <div>
                <FlexContainer jc="flex-end" column style={{ borderRadius: '9px', padding: '20px', fontSize: '20px', backgroundColor: '#fff2c5' }}>
                  <div>
                    If you haven't registered yet, register now and try <b>Wizex CodeMonitor</b> For FREE for 14 days.
                  </div>
                  <SmallButton onClick={handleGotoRegistration} btn="green" style={{ marginTop: '20px', fontSize: '18px', padding: '20px' }}>Registration</SmallButton>
                </FlexContainer>
              </div>
              : freeTrial
                ? <div>
                  <FlexContainer jc="flex-end" column style={{ borderRadius: '9px', padding: '20px', fontSize: '20px', backgroundColor: '#e6ffe8' }}>
                    <div>
                      Try <b>Wizex CodeMonitor</b> FREE for 14 days.
                    </div>
                    <SmallButton onClick={handleGotoFree} btn="green" style={{ marginTop: '20px', fontSize: '18px', padding: '20px' }}>Try It For Free</SmallButton>
                  </FlexContainer>
                </div>
                : null
            }
          </div>
          <h3>Key Features</h3>
          <ul>
            <li>
              <b>Account Creation and Management:</b> Sign up and log in to your personal dashboard where you can manage all your web projects. Each account is secure and ensures that your projects and data are protected.
            </li>
            <li>
              <b>Project Integration:</b> Add your web projects to {CodeMonitor} easily. Each project will receive a unique identifier that you can integrate into your source code. This identifier allows seamless communication between your web project and the {CodeMonitor} platform.
            </li>
            <li>
              <b>Custom Code Snippets:</b> Generate specific code snippets tailored for your project. These snippets are designed to be added to your source code, enabling you to track and monitor various aspects of your application in real-time.
            </li>
            <li>
              <b>Flexible Function Integration:</b> Insert custom functions into your project code at strategic points. These functions can send any data you want to {CodeMonitor} - be it error descriptions, timer results, user activity logs, or any other relevant information.
            </li>
          </ul>
          <h3>How It Works</h3>
          <ul>
            <li>
              <b>Sign Up and Create an Account:</b> Begin by signing up for a {CodeMonitorTitle} account. Once registered, you can log in to access your dashboard.
            </li>
            <li>
              <b>Add Your Project:</b> Navigate to the "Add Project" section and enter the necessary details for your web project. {CodeMonitor} will generate a unique project identifier for you.
            </li>
            <li>
              <b>Integrate Code Snippets:</b> Copy the provided code snippet and paste it into your project's source code. This snippet will establish a connection between your project and {CodeMonitor}.
            </li>
            <li>
              <b>Methods of application</b>
              <ul className="use-cases">
                <li>
                  <div><b>For browsers (client part):</b></div>
                  <b>Script loading method</b> You can add a script to the head tag. And then create a function that you will use in the future. Using this approach eliminates the problem of updating the token every time it changes. We remind you that the validity period of the token corresponds to the validity period of the paid tariff.
                  <div className='code language-javascript' style={{ overflow: 'auto', whiteSpace: 'pre', backgroundColor: '#e5e5e5', borderRadius: '9px' }}>
                    {`
        <head>
          <script async src="https://codemanitor.wizex.pro/rest/wxmanager?key=PROJECT_API_KEY" />
        </head>
        ...            
        function reportError(errorDescription) {
          // Make sure it's a browser (Important for SSR projects)
          if (typeof window !== 'undefined' && window.Wizex) {
            Wizex.log({
              message: errorDescription
            })
          }
        }
                    
                    `}

                  </div>
                  <div style={{ marginTop: '32px' }}></div>
                  <b>Direct API call</b> You can create your own function that will call the service directly. For this, it is necessary to have an access token to the project and monitor its relevance. The token changes every time the account balance is replenished. So in this approach you will need to manually track the validity of the token.
                  <div className='code language-javascript' style={{ overflow: 'auto', whiteSpace: 'pre', backgroundColor: '#e5e5e5', borderRadius: '9px' }}>
                    {`
        function reportError(errorDescription) {            
          const token = 'YOUR_PROJECT_TOKEN';
          fetch('https://codemonitor.wizex.pro/rest/loghook', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-WIZEX': token
            },
            body: JSON.stringify({error: errorDescription })
          });
        }
                    
                    `}

                  </div>


                </li>

                <li>
                  <div style={{ marginTop: '32px' }}><b>For the Server:</b></div>
                  <b>An example of using CURL</b>
                  <div className='code language-javascript' style={{ overflow: 'auto', whiteSpace: 'pre', backgroundColor: '#e5e5e5', borderRadius: '9px' }}>
                    {`
      # curl -X POST https://codemonitor.wizex.pro/rest/loghook 
          -H 'Accept: application/json'
          -H 'Content-Type: application/json'
          -H 'X-WIZEX: YOUR_PROJECT_TOKEN' 
          -d '{"message": YOUR_MESSAGE}'
                    `}

                  </div>
                  <div style={{ marginTop: '32px' }}></div>
                  <b>Example for NodeJS</b> You can also create a function using a convenient transport, such as the axios node library. Use an environment variable to define the token value.

                  <div className='code language-javascript' style={{ overflow: 'auto', whiteSpace: 'pre', backgroundColor: '#e5e5e5', borderRadius: '9px' }}>
                    {`
        const axios = require('axios');

        function reportError(errorDescription) {            
          const token = process.env.WIZEX_TOKEN;
          
          axios.post('https://codemonitor.wizex.pro/rest/loghook',
           { message: errorDescription },
           {
             headers: {
              'Content-Type': 'application/json',
              'X-WIZEX': token        
             }
          });  
        }
                    `}
                  </div>
                </li>
              </ul>
            </li>
          </ul>
          <h3>Use Cases</h3>
          <ul className="use-cases">
            <li>
              <b>Error Tracking:</b> Automatically send detailed error descriptions to {CodeMonitor} whenever an error occurs in your application. This helps in quickly identifying and resolving issues.
            </li>
            <li>
              <b>Performance Monitoring:</b> Send performance metrics like timer results or API response times to {CodeMonitor}. Analyze this data to optimize the performance of your web project.
            </li>
            <li>
              <b>User Activity Logs:</b> Track user activities and behaviors within your application by sending relevant data to {CodeMonitor}. This can help in enhancing user experience and engagement.
            </li>
          </ul>

          <h3>Conclusion</h3>
          {CodeMonitor} is your go - to solution for enhancing your development workflow with efficient monitoring and debugging capabilities.By integrating {CodeMonitor} into your web projects, you can gain valuable insights, swiftly address issues, and improve the overall performance of your applications.Sign up today and take your web development to the next level with {CodeMonitor}!
        </div >
        : (
          locale === 'uk'
            ? <div>
              <p>
                Запрошуємо спробувати до використання {CodeMonitorTitle}, інноваційну веб-платформу, призначену для оптимізації процесів налагодження та моніторингу для розробників. {CodeMonitor} надає зручний інтерфейс, за допомогою якого розробники можуть створити обліковий запис і легко керувати своїми веб-проектами.
              </p>
              <div>
                {!User.userIsLoggedIn()
                  ? <div>
                    <FlexContainer jc="flex-end" column style={{ borderRadius: '9px', padding: '20px', fontSize: '20px', backgroundColor: '#fff2c5' }}>
                      <div>
                        Якщо ви ще не зареєстровані, зареєструйтеся зараз і спробуйте <b>Wizex CodeMonitor</b> безкоштовно протягом 14 днів.
                      </div>
                      <SmallButton onClick={handleGotoRegistration} btn="green" style={{ marginTop: '20px', fontSize: '18px', padding: '20px' }}>Реєстрація</SmallButton>
                    </FlexContainer>
                  </div>
                  : freeTrial
                    ? <div>
                      <FlexContainer jc="flex-end" column style={{ borderRadius: '9px', padding: '20px', fontSize: '20px', backgroundColor: '#e6ffe8' }}>
                        <div>
                          Спробуйте  <b>Wizex CodeMonitor</b> безкоштовно протягом 14 днів.
                        </div>
                        <SmallButton onClick={handleGotoFree} btn="green" style={{ marginTop: '20px', fontSize: '18px', padding: '20px' }}>Спробувати безкоштовно</SmallButton>
                      </FlexContainer>
                    </div>
                    : null
                }
              </div>
              <h3>Ключові особливості</h3>
              <ul>
                <li>
                  <b>Створення облікового запису та керування ним:</b> Зареєструйтеся та увійдіть на особисту інформаційну панель, де ви можете керувати всіма своїми веб-проектами. Кожен обліковий запис є безпечним і гарантує захист ваших проектів і даних.
                </li>
                <li>
                  <b>Інтеграція проекту:</b> Легко додайте свої веб-проекти до {CodeMonitor}. Кожен проект отримає унікальний ідентифікатор, який можна інтегрувати у вихідний код. Цей ідентифікатор забезпечує безперебійний зв’язок між вашим веб-проектом і платформою {CodeMonitor}.
                </li>
                <li>
                  <b>Спеціальні фрагменти коду:</b> Створюйте спеціальні фрагменти коду, адаптовані для вашого проекту. Ці фрагменти призначені для додавання до вихідного коду, що дає змогу відстежувати та контролювати різні аспекти вашої програми в режимі реального часу.
                </li>
                <li>
                  <b>Гнучка інтеграція функцій:</b> Вставте спеціальні функції в код вашого проекту в стратегічних точках. Ці функції можуть надсилати до {CodeMonitor} будь-які дані, будь то описи помилок, результати таймерів, журнали активності користувачів або будь-яка інша відповідна інформація.
                </li>
              </ul>
              <h3>Як це працює</h3>
              <ul>
                <li>
                  <b>Зареєструйтеся та створіть обліковий запис:</b> Почніть із реєстрації облікового запису CodeMonitor. Після реєстрації ви можете увійти, щоб отримати доступ до панелі інструментів.
                </li>
                <li>
                  <b>Додайте свій проект:</b> Перейдіть до розділу «Додати проект» і введіть необхідні дані для свого веб-проекту. {CodeMonitor} створить для вас унікальний ідентифікатор проекту.
                </li>
                <li>
                  <b>Інтегруйте фрагменти коду:</b> Скопіюйте наданий фрагмент коду та вставте його у вихідний код вашого проекту. Цей фрагмент встановить зв’язок між вашим проектом і {CodeMonitor}.
                </li>
                <li>
                  <b>Методи застосування</b>
                  <ul className="use-cases">
                    <li>
                      <div><b>В браузері (сторона клієнта):</b></div>
                      <b>Загрузити скрипт</b> Ви можете додати script до тегу head. А потім створіть функцію, якою будете користуватися для відправки повідомлень до сервісу. Використання цього підходу усуває проблему оновлення токена щоразу, коли він змінюється. Нагадуємо, що термін дії токена відповідає терміну дії оплаченого тарифу.
                      <div className='code language-javascript' style={{ overflow: 'auto', whiteSpace: 'pre', backgroundColor: '#e5e5e5', borderRadius: '9px' }}>
                        {`
        <head>
          <script async src="https://codemanitor.wizex.pro/rest/wxmanager?key=PROJECT_API_KEY" />
        </head>
        ...            
        function reportError(errorDescription) {
          // Переконайтесь що код виконується в браузері.
          // Це особливо важливо для SSR додатків
          if (typeof window !== 'undefined' && window.Wizex) {
            Wizex.log({
              message: errorDescription
            })
          }
        }
                    `}

                      </div>
                      <div style={{ marginTop: '32px' }}></div>
                      <b>Пряме використання API</b> Ви можете створити власну функцію, яка буде безпосередньо викликати службу. Для цього необхідно мати токен доступу до проекту та стежити за його актуальністю. Токен змінюється кожного разу, коли баланс рахунку поповнюється. Тому в цьому підході вам потрібно буде вручну відстежувати дійсність токена.
                      <div className='code language-javascript' style={{ overflow: 'auto', whiteSpace: 'pre', backgroundColor: '#e5e5e5', borderRadius: '9px' }}>
                        {`
        function reportError(errorDescription) {            
          const token = 'YOUR_PROJECT_TOKEN';
          fetch('https://codemonitor.wizex.pro/rest/loghook', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-WIZEX': token
            },
            body: JSON.stringify({error: errorDescription })
          });
        }
                    `}
                      </div>
                    </li>
                    <li>
                      <div style={{ marginTop: '32px' }}><b>Для Сервера:</b></div>
                      <b>Приклад з використанням CURL</b>
                      <div className='code language-javascript' style={{ overflow: 'auto', whiteSpace: 'pre', backgroundColor: '#e5e5e5', borderRadius: '9px' }}>
                        {`
      # curl -X POST https://codemonitor.wizex.pro/rest/loghook 
          -H 'Accept: application/json'
          -H 'Content-Type: application/json'
          -H 'X-WIZEX: YOUR_PROJECT_TOKEN' 
          -d '{"message": YOUR_MESSAGE}'
                    `}

                      </div>
                      <div style={{ marginTop: '32px' }}></div>
                      <b>Приклад для NodeJS</b> Ви можете створити функцію за допомогою зручного транспорту, наприклад, бібліотеки axios. Добавте змінну середовища, наприклад з іменем  WIZEX_TOKEN. Ось приклад імплементації такого рішення:

                      <div className='code language-javascript' style={{ overflow: 'auto', whiteSpace: 'pre', backgroundColor: '#e5e5e5', borderRadius: '9px' }}>
                        {`
        const axios = require('axios');

        function reportError(errorDescription) {            
          const token = process.env.WIZEX_TOKEN;
          
          axios.post('https://codemonitor.wizex.pro/rest/loghook',
           { message: errorDescription },
           {
             headers: {
              'Content-Type': 'application/json',
              'X-WIZEX': token        
             }
          });  
        }
                    `}
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
              <h3>Випадки використання</h3>
              <ul className="use-cases">
                <li>
                  <b>Відстеження помилок:</b> Автоматично надсилайте докладні описи помилок до {CodeMonitor} щоразу, коли у вашій програмі виникає помилка. Це допомагає швидко виявити та вирішити проблеми.
                </li>
                <li>
                  <b>Моніторинг продуктивності:</b> Надсилайте показники продуктивності, наприклад результати таймера або час відповіді API, до {CodeMonitor}. Проаналізуйте ці дані, щоб оптимізувати продуктивність вашого веб-проекту.
                </li>
                <li>
                  <b>Журнали активності користувачів:</b> відстежуйте дії та поведінку користувачів у своїй програмі, надсилаючи відповідні дані до {CodeMonitor}. Це може допомогти покращити взаємодію з користувачем і залучення.
                </li>
              </ul>

              <h3>Висновок</h3>
              {CodeMonitor} — це ваше найкраще рішення для покращення робочого процесу розробки за допомогою ефективних можливостей моніторингу та налагодження. Інтегрувавши {CodeMonitor} у ваші веб-проекти, ви можете отримати цінну інформацію, швидко вирішувати проблеми та покращувати загальну продуктивність своїх програм. Зареєструйтеся сьогодні та виведіть свою веб-розробку на новий рівень за допомогою {CodeMonitor}!
            </div>
            : null
        )
    }
    </div >
  )

}

const HomePage = (props = {}) => {
  const { projects = [] } = props.data;
  const [freeTrial, setFreeTrial] = useState(false);
  console.log('home-page props:', props);

  const { locale } = useRouter();

  useEffect(() => {
    //document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelectorAll('div.code').forEach((el) => {
      console.log('wow el:', el);
      hljs.highlightElement(el);
    });
    //});
    if (User.userIsLoggedIn()) {
      const { trialwasused, userPaiedAtLeastOneTime } = User.read();
      console.log('trialwasused, userPaiedAtLeastOneTime', trialwasused, userPaiedAtLeastOneTime);
      if (!trialwasused && !userPaiedAtLeastOneTime) {
        setFreeTrial(true);
      }
    }
  }, []);

  return (
    <div>
      {/* <ActiveProjects projectList={projects} {...props}/> */}
      <ProjectDescriptionStyled>
        {getPromotionContent({ locale, freeTrial })}
      </ProjectDescriptionStyled>
      <div style={{ padding: '8px', textAlign: 'center', margin: '32px 0 8px 0', borderTop: '1px #ededed solid' }}>
        <span >&copy; Copyright 2024 wizex.pro</span>
      </div>
    </div>
  )
};

export default HomePage;


//curl -X POST http://localhost:4223/rest/loghook -H 'Accept: application/json' -H 'Content-Type: application/json' -H 'X-WIZEX: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwicGkiOjMsImFwaUtleSI6IjA3ODQzNDM2LTU1YTMtNDZkZi04MTg1LTljM2NlZDYyYTJjNyIsImlhdCI6MTcyMjE3MzYxNiwiZXhwIjoxNzI0NzY1NjE2fQ.OO8bUK_rE_R73L0zfcXFUgFqQHupZungd95jAuhcAqQ' -d '{"message": "test curl message", "id": "12345"}'