import { BackgroundGradientAnimation } from "./BackgroundGradientAnimation";

export function ConnectBanner() {
  return (
    <section className="connect-band" id="connect">
      <div className="connect-band-bg" aria-hidden="true">
        <BackgroundGradientAnimation
          gradientBackgroundStart="rgb(10, 10, 14)"
          gradientBackgroundEnd="rgb(0, 0, 0)"
          firstColor="60, 80, 140"
          secondColor="120, 60, 180"
          thirdColor="40, 120, 200"
          fourthColor="200, 90, 70"
          fifthColor="130, 110, 90"
          pointerColor="120, 90, 200"
          size="70%"
          blendingValue="screen"
          interactive={false}
        />
      </div>
      <div className="connect-band-inner">
        <div className="wrap">
          <div className="connect-band-grid">
            <div>
              <h2>Ready to build something great?</h2>
              <p>Let&apos;s discuss your project and explore how we can help you achieve your goals.</p>
            </div>
            <a className="connect-cta" href="/contact">
              Let&apos;s work together
              <span className="arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
