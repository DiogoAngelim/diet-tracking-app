import { render, screen } from '@testing-library/react';
import { HomeScreen } from '../home-screen';

describe('HomeScreen', () => {
  const RealDate = Date;
  function mockDate(hour: number) {
    global.Date = class extends RealDate {
      constructor() {
        super();
        // Always use local time for the hour
        const now = new RealDate();
        now.setHours(hour, 0, 0, 0);
        return now;
      }
      static now() {
        const now = new RealDate();
        now.setHours(hour, 0, 0, 0);
        return now.getTime();
      }
    } as any;
  }
  afterEach(() => {
    global.Date = RealDate;
  });

  it('renders morning greeting', () => {
    mockDate(8);
    render(
      <HomeScreen
        userName="Test User"
        mealsToday={3}
        caloriesToday={1500}
        proteinToday={90}
      />
    );
    expect(screen.getByText(/good morning/i)).toBeInTheDocument();
  });

  it('renders afternoon greeting', () => {
    mockDate(15);
    render(
      <HomeScreen
        userName="Test User"
        mealsToday={3}
        caloriesToday={1500}
        proteinToday={90}
      />
    );
    expect(screen.getByText(/good afternoon/i)).toBeInTheDocument();
  });

  it('renders evening greeting', () => {
    mockDate(20);
    render(
      <HomeScreen
        userName="Test User"
        mealsToday={3}
        caloriesToday={1500}
        proteinToday={90}
      />
    );
    expect(screen.getByText(/good evening/i)).toBeInTheDocument();
  });
});
