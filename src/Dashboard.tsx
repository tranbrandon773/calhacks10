import { useEffect, useState } from 'react';
import './Dashboard.css';
import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import DashboardCard from "./components/dashboard_cards";
import chickyAILogo from './logo.svg';
import Navbar from "./components/navbar";

export default function Dashboard() {
    const summarizeChat = useAction(api.messages.summarizeChat)
    const [heartHealthTopics, setHeartHealthTopics] = useState([]);
    const [heartAttackTopics, setHeartAttackTopics] = useState([]);
    const [chatSummary, setChatSummary] = useState(["Loading summary.."]);
    //API we are using:
    //https://health.gov/our-work/health-literacy/consumer-health-content/free-web-content/apis-developers/documentation
    useEffect(() => {
        summarizeChat()
            .then(data => {
                (data !== null) ? setChatSummary([data]) : setChatSummary(["Summary is null"])
            })
            .catch(error => console.error('Error fetching chat summary:', error));
        fetch('https://health.gov/myhealthfinder/api/v3/topicsearch.json?lang=en&keyword=heart%20health')
            .then(response => response.json())
            .then(data => {
                const topicsData = data.Result.Resources.Resource.map(resource => ({
                    title: resource.Title,
                    url: resource.AccessibleVersion
                }));
                setHeartHealthTopics(topicsData);
            })
            .catch(error => console.error('Error fetching heart health data:', error));

        fetch('https://health.gov/myhealthfinder/api/v3/topicsearch.json?lang=en&keyword=heart%20attack')
            .then(response => response.json())
            .then(data => {
                const topicsData = data.Result.Resources.Resource.map(resource => ({
                    title: resource.Title,
                    url: resource.AccessibleVersion
                }));
                setHeartAttackTopics(topicsData);
            })
            .catch(error => console.error('Error fetching heart attack data:', error));

    }, []);

    const heartHealthContent = (
        <ul>
            {heartHealthTopics.map((topic, index) => (
                <li key={index}>
                    <a href={topic.url} target="_blank" rel="noopener noreferrer">{topic.title}</a>
                </li>
            ))}
        </ul>
    );

    const heartAttackContent = (
        <ul>
            {heartAttackTopics.map((topic, index) => (
                <li key={index}>
                    <a href={topic.url} target="_blank" rel="noopener noreferrer">{topic.title}</a>
                </li>
            ))}
        </ul>
    );
    const allTopics = [...heartHealthTopics, ...heartAttackTopics];

// Function to filter out duplicates based on title and URL
const uniqueTopics = allTopics.filter((topic, index, self) => 
    index === self.findIndex((t) => (
        t.title === topic.title && t.url === topic.url
    ))
);

const combinedHeartContent = (
    <div>
    <p>All information provided by the <b>United States Office of Disease Prevention and Health Promotion</b>.</p>
    <h3 style={{ color: '#FF69B4' }}>Heart Health & Attack Topics</h3>
    <ul>
        {uniqueTopics.map((topic, index) => (
            <li key={index}>
                <a href={topic.url} target="_blank" rel="noopener noreferrer" style={{ color: '#3299ff', fontWeight: 600 }}>{topic.title}</a>
            </li>
        ))}
    </ul>
</div>

);
const [loadingKeyTerms, setLoadingKeyTerms] = useState(true); // New state for loading simulation

    useEffect(() => {
        // Delay the loading of key terms by 2 seconds (2000 milliseconds)
        const timer = setTimeout(() => {
            setLoadingKeyTerms(false);
        }, 3000);

        // Cleanup to avoid memory leaks
        return () => clearTimeout(timer);
    }, []); // Dependency array is empty to make sure this effect runs once on mount

    const keyTermsContent = loadingKeyTerms ? "\n\nLoading key terms..." : (
        <div>
            <ul style={{ listStyleType: 'none', paddingLeft: '0', margin: '1rem 0' }}>
                <li><strong>PET myocardial perfusion imaging:</strong> A heart scan that measures blood flow in the heart.</li>
                <li><strong>Ischemia:</strong> A condition where the heart muscle doesn't get enough blood.</li>
                <li><strong>Global left ventricular systolic function:</strong> How well the main pumping chamber (left ventricle) of the heart contracts.</li>
                <li><strong>Electrocardiogram:</strong> A test that measures the electrical activity of the heart.</li>
                <li><strong>CT (Computed Tomography):</strong> A type of X-ray that gives detailed pictures of structures inside the body.</li>
            </ul>
        </div>
    );
    return (
        <div className="dashboard-container">
            <Navbar />
            <div className="dashboard-grid">
                <DashboardCard title="Chat Summary" content={`\n\n${chatSummary}`} />
                <DashboardCard title="Key Terms" content={keyTermsContent} />
                <DashboardCard title="Public Health Resources" content={combinedHeartContent} />
            </div>
            <div className="powered-by">
                <span>Powered with ❤️ by ChickyAI</span>
                <img src={chickyAILogo} alt="ChickyAI Logo" className="powered-logo App-logo" />
            </div>

        </div>
    );
}
