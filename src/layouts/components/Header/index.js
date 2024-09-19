import React from "react";
import { Carousel } from "react-bootstrap";
import styles from "../Header/Header.module.scss";
import classNames from "classnames/bind";
import crowd_background from "../../../assets/images/crowd-background.jpg";
import movie_background from "../../../assets/images/movie-background.jpg";
import sport_background from "../../../assets/images/sport-background.png";

function Header() {
  const cx = classNames.bind(styles);
  return (
    <Carousel interval={3000} controls={false} indicators={true} pause="hover">
      <Carousel.Item>
        <div
          className={cx("img-slides")}
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(142,101,255,0.7) 0%, rgba(117,145,249,0.7) 50%, rgba(85,207,235,0.7) 100%),url(${crowd_background})`,
          }}
        ></div>
        <Carousel.Caption>
          <h3>First Slide</h3>
          <p>Description for the first slide.</p>
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
          <h3>Second Slide</h3>
          <p>Description for the second slide.</p>
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
          <h3>Third Slide</h3>
          <p>Description for the third slide.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default Header;
