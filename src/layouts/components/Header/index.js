import React from "react";
import { Carousel } from "react-bootstrap";
import styles from "./Header.module.scss";
import classNames from "classnames/bind";
import crowd_background from "../../../assets/images/vuconcert.jpg";
import movie_background from "../../../assets/images/movie-background.jpg";
import sport_background from "../../../assets/images/sport-background.png";
import NavigationBar from "../NavBar";

function Header() {
  const cx = classNames.bind(styles);
  return (
    <>
      <NavigationBar/>
      <div className={cx("container")}>
      <Carousel interval={3000} controls={false} indicators={true} pause="hover" style={{paddingTop:'6vh'}}>
        <Carousel.Item>
          <div
            className={cx("img-slides")}
            style={{
              backgroundImage: `url(${crowd_background})`,
            }}
          ></div>
          <Carousel.Caption>
            <h3>Buy tickets easily, attractive prices!</h3>
            <p>Last chance! There are very few tickets left for your favorite events, don't miss out!</p>
          </Carousel.Caption>
        </Carousel.Item>
  
        <Carousel.Item>
          <div
            className={cx("img-slides")}
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(142,101,255,0.7) 0%, rgba(117,145,249,0.7) 50%, rgba(85,207,235,0.7) 100%),url(${movie_background})`,
            }}
          ></div>
          <Carousel.Caption>
            <h3>Golden opportunity - Buy tickets immediately</h3>
            <p>Discount today! Buy tickets at discounted prices for only 24 hours!</p>
          </Carousel.Caption>
        </Carousel.Item>
  
        <Carousel.Item>
          <div
            className={cx("img-slides")}
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(142,101,255,0.7) 0%, rgba(117,145,249,0.7) 50%, rgba(85,207,235,0.7) 100%),url(${sport_background})`,
            }}
          ></div>
          <Carousel.Caption>
            <h3>Buy tickets very quickly - Great deals!</h3>
            <p>Experience memorable moments, tickets are just a click away!</p>
          </Carousel.Caption>
        </Carousel.Item>
        
      </Carousel>
      </div>
    </>
  );
}

export default Header;
