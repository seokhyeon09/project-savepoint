import './Landing.scss'
import { NavLink } from 'react-router-dom'
import Button from '../../components/ui/Button'

const Landing = () => {
  return (
    <section className='landing'>
      <div className="landing-bg">
        {/* 배경 백그라운드 */}
        <div className="t-bg">
          <div className="t-wrap">
            <h2>
              <img src="/assets/logo.svg" alt="Logo" />
            </h2>
            <h2>
              <img src="/assets/logo2.svg" alt="Logo" />
            </h2>
            <p>
              지나온 게임의 길을 한 눈에
            </p>
            <NavLink to='/login'>
              <Button text='시작하기' className='intro' />
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;