import React from "react";
import "./styles.css";

interface Options {
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  vertical?: boolean;
}

interface State {
  value: number;
  previousValue: number;
}

export default class Slider extends React.Component<Options, State> {
  state: State;
  min: number;
  max: number;
  step: number;
  disabled: boolean;
  vertical?: boolean;
  inner: React.RefObject<HTMLDivElement>;
  track: React.RefObject<HTMLDivElement>;
  trackFill: React.RefObject<HTMLDivElement>;
  thumb: React.RefObject<HTMLDivElement>;

  constructor(props: Options) {
    super(props);

    const { min = 0, max = 100, step = 1, disabled = false, vertical = false } = props;

    this.state = {
      value: 0,
      previousValue: 0,
    };

    this.min = min;
    this.max = max;
    this.step = step;
    this.disabled = disabled;
    this.vertical = vertical;

    this.inner = React.createRef();
    this.track = React.createRef();
    this.trackFill = React.createRef();
    this.thumb = React.createRef();

    this.rangeMousedown = this.rangeMousedown.bind(this);
    this.rangeMousemove = this.rangeMousemove.bind(this);
    this.rangeMouseup = this.rangeMouseup.bind(this);
  }

  componentDidMount(): void {
    this.inner.current.addEventListener("mousedown", this.rangeMousedown);
    this.track.current.addEventListener("mousedown", this.rangeMousedown);
    this.trackFill.current.addEventListener("mousedown", this.rangeMousedown);
    this.thumb.current.addEventListener("mousedown", this.rangeMousedown);
  }

  componentWillUnmount(): void {
    this.inner.current.removeEventListener("mousedown", this.rangeMousedown);
    this.track.current.removeEventListener("mousedown", this.rangeMousedown);
    this.trackFill.current.removeEventListener("mousedown", this.rangeMousedown);
    this.thumb.current.removeEventListener("mousedown", this.rangeMousedown);
  }

  rangeMousedown(event: MouseEvent) {
    event.preventDefault();
    event.stopImmediatePropagation();

    if (!this.disabled) {
      const position = this.getPosition(event);

      const range = this.max - this.min;
      const valueInRange = range * position + this.min;
      const value = Math.round(valueInRange / this.step) * this.step;

      document.addEventListener("mousemove", this.rangeMousemove);
      document.addEventListener("mouseup", this.rangeMouseup);

      this.setValue(value);
    }
  }

  rangeMousemove(event: MouseEvent) {
    if (!this.disabled) {
      const position = this.getPosition(event);

      const range = this.max - this.min;
      let valueInRange = range * position + this.min;
      valueInRange = Math.max(this.min, Math.min(valueInRange, this.max));
      const value = Math.round(valueInRange / this.step) * this.step;

      if (value === this.state.value || value === this.state.previousValue) {
        return;
      }

      this.setValue(value);
    }
  }

  rangeMouseup() {
    document.removeEventListener("mousemove", this.rangeMousemove);
    document.removeEventListener("mouseup", this.rangeMouseup);
  }

  getPosition(event: MouseEvent): number {
    const coordinates = this.inner.current.getBoundingClientRect();
    const widthOrHeight = this.vertical ? coordinates.height : coordinates.width;
    const a = this.vertical ? event.pageY : event.pageX;
    const b = this.vertical ? coordinates.top : coordinates.left;
    const clickPosition = (a - b) / widthOrHeight;

    return Math.max(0, Math.min(1, clickPosition));
  }

  setValue(value: number) {
    this.setState({
      value,
      previousValue: this.state.value,
    });
  }

  render() {
    const thumbStyle = {
      [this.vertical ? "top" : "left"]: String(this.state.value) + "%",
    };
    const trackFillStyle = {
      [this.vertical ? "height" : "width"]: String(this.state.value) + "%",
    };

    const innerClassNames = "inner" + " " + (this.vertical ? "vertical" : "");
    const trackClassNames = "track" + " " + (this.vertical ? "vertical" : "");
    const trackFillClassNames = "trackFill" + " " + (this.vertical ? "vertical" : "");
    const thumbClassNames = "thumb" + " " + (this.vertical ? "vertical" : "");

    return (
      <div ref={this.inner} className={innerClassNames}>
        <div ref={this.track} className={trackClassNames}></div>
        <div ref={this.trackFill} className={trackFillClassNames} style={trackFillStyle}></div>
        <div ref={this.thumb} className={thumbClassNames} style={thumbStyle}></div>
      </div>
    );
  }
}