const DashboardCard = ({ title, content }) => {
    return (
        <div className="dashboard-card">
            <h2>{title}</h2>
            {content}
        </div>
    );
};

export default DashboardCard