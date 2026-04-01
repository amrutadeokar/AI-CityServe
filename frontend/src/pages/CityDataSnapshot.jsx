import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Air Quality', value: 1886 },
  { name: 'Traffic Flow', value: 2691 },
  { name: 'Noise', value: 1200 },
  { name: 'Waste', value: 800 },
];

function CityDataSnapshot() {
  return (
    <div className="info-card">
      <div className="info-header">
        <span>📊</span> City Data Snapshot
      </div>
      <div className="info-content">
        <div className="city-snapshot-row">
          <div className="city-text">
            <p>Air Quality: 1886</p>
            <p>Traffic Flow: 2691</p>
          </div>
          <div className="bar-chart-placeholder">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#4A90E2" />
                <Bar dataKey="value" fill="#50C878" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CityDataSnapshot;
