import { useRouter } from "next/router"
import { useEffect, useRef } from "react"
import Observer from '~/utils/observer';


const usePreserveScroll = () => {
  const router = useRouter()

  const scrollPositions = useRef({})
  const isBack = useRef(false)

  useEffect(() => {
    router.beforePopState((state) => {
      window.history.scrollRestoration = 'manual';
      state.options.scroll = false;
      Observer.send('onBrowserForwardBack');
      isBack.current = true
      return true
    })

    const onRouteChangeStart = () => {
      let url = router.asPath;

      const subStrLocale = url.slice(1, 3);
      if (!url.startsWith('/') || !router.locales.includes(subStrLocale)) {
        url = `/${router.locale}${url}`;
      }
      url = url.replace(/\?.*/g, '');
      scrollPositions.current[url] = window.scrollY
    }

    const onRouteChangeComplete = (url) => {
      if (isBack.current && scrollPositions.current[url]) {
        setTimeout(() => window.scroll({
          top: scrollPositions.current[url],
          behavior: "auto",
        }), 300);
      }

      isBack.current = false
    }

    router.events.on("routeChangeStart", onRouteChangeStart)
    router.events.on("routeChangeComplete", onRouteChangeComplete)

    return () => {
      router.events.off("routeChangeStart", onRouteChangeStart)
      router.events.off("routeChangeComplete", onRouteChangeComplete)
    }
  }, [router])
};

export default usePreserveScroll;
