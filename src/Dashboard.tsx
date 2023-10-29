import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";

const DashboardCard = ({ title, content }) => {
    return (
        <div className="dashboard-card">
            <h2>{title}</h2>
            {content}
        </div>
    );
};

export default function Dashboard() {
    const summarizeChat = useAction(api.messages.summarizeChat)
    const [heartHealthTopics, setHeartHealthTopics] = useState([]);
    const [heartAttackTopics, setHeartAttackTopics] = useState([]);
    const [chatSummary, setChatSummary] = useState([]);
    // const [chatSummary, setChatSummary] = useState([]);
    //API we are using:
    //https://health.gov/our-work/health-literacy/consumer-health-content/free-web-content/apis-developers/documentation
    useEffect(() => {
        summarizeChat()
            .then( data => setChatSummary(chatSummary))
            .catch(error => console.error('Error fetching heart health data:', error));
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

    return (
        <div className="dashboard-container">
            <div className="dashboard-grid">
                <DashboardCard title="Chat summary" content={ chatSummary } />
                <DashboardCard title="Key terms defined" />
                <DashboardCard title="Heart Health Topics" content={heartHealthContent} />
                <DashboardCard title="Heart Attack Topics" content={heartAttackContent} />
            </div>
        </div>
    );
}
