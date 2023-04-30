import { Transition } from "react-transition-group";
import { Component, createRef } from "react";
import PropTypes from "prop-types";
import "./styles.css"

interface IProps {
  value?: number;
  infinite?: boolean;
  completed?: boolean;
}

interface IState {
  progress: number;
  animate: boolean;
  completed: boolean;
}

class TopLoadingBar extends Component<IProps, IState> {
  progressInterval: NodeJS.Timer | undefined;
  nodeRef = createRef<HTMLDivElement>();

  static propTypes = {
    value: PropTypes.number,
    infinite: PropTypes.bool,
    completed: PropTypes.bool,
  };

  state: IState = {
    progress: 0,
    animate: true,
    completed: false
  };

  componentDidUpdate(prevProps: IProps): void {
    const { value, completed, infinite } = this.props;

    if (value !== prevProps.value) {
      this.setState({ progress: value || 0 });
    }

    if (completed && !prevProps.completed) {
      this.setState({ progress: 100 });
      this.setState({ animate: false });
    }

    if (!completed && prevProps.completed) {
      this.setState({ progress: 0 });
      this.setState({ animate: true });
    }

    if (completed) {
      this.clearInfiniteProgress()
    }

    if ((infinite && !this.progressInterval) && (!completed && prevProps.completed)) {
      this.infiniteProgress();
    }

    if (value && value === 100) {
      this.state.completed = true;
    }
  }

  componentDidMount(): void {
    const { value, infinite } = this.props;

    if (infinite) {
      this.infiniteProgress();
    } else if (value) {
      this.setState({ progress: value });
    }
  }

  componentWillUnmount(): void {
    this.clearInfiniteProgress();
  }

  infiniteProgress = () => {
    this.progressInterval = setInterval(() => {
      const { progress } = this.state;

      // Constants
      const max = 100;
      const speed = 0.1;
      const slowDownPoint = 70;
      const wave = Math.random() * 0.5;

      if (progress > slowDownPoint) {
        // Progress interval [0, 1]
        const p = progress / max;
        const f = 1 - Math.pow(p, 2); // f(p) = 1-x^2
        const i = f * speed;
        const np = Math.min(max, Math.max(slowDownPoint, progress + i));
        this.setState({ progress: np });
      } else {
        this.setState((prevState: IState) => ({
          progress: prevState.progress + wave,
        }));
      }
    }, 100);
  };

  clearInfiniteProgress = () => {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = undefined;
    }
  };

  render(): JSX.Element {
    const { completed } = this.props;
    const { progress, animate } = this.state;

    const transition = this.props.infinite ? !completed && animate : !this.state.completed

    return (
      <Transition nodeRef={this.nodeRef} in={transition} timeout={500} unmountOnExit>
        {(state) => (
          <div ref={this.nodeRef} className={`progress-bar ${state === "exiting" ? "progress-bar-exit" : ""}`}>
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        )}
      </Transition>
    );
  }
}

export default TopLoadingBar;
