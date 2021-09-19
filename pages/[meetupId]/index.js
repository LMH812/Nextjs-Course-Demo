import Head from 'next/head'
import { MongoClient, ObjectId } from 'mongodb'
import { Fragment } from 'react'
import MeetDetail from '../../components/meetups/MeetDetail'
function MeetupDetails(props) {
    return (
        <Fragment>
            <Head>
                <title>{props.meetupData.title}</title>
                <meta name="description" content={props.meetupData.description} />
            </Head>
            <MeetDetail
                image={props.meetupData.image}
                title={props.meetupData.title}
                address={props.meetupData.address}
                description={props.meetupData.description}
            />
        </Fragment>
    )
}

export async function getStaticPaths() {
    const client = await MongoClient.connect(
        'mongodb+srv://test:xjWQpPBWUcJtVEbu@cluster0.fj6g3.mongodb.net/meetups?retryWrites=true&w=majority'
    )
    const db = client.db()
    const meetupsCollection = db.collection('meetups')
    const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray()
    client.close()
    return {
        fallback: false,
        paths: meetups.map((meetup) => ({
            params: { meetupId: meetup._id.toString() },
        })),
    }
}

export async function getStaticProps(context) {
    // fetch data for a single meetup
    const meetupId = context.params.meetupId
    const client = await MongoClient.connect(
        'mongodb+srv://test:xjWQpPBWUcJtVEbu@cluster0.fj6g3.mongodb.net/meetups?retryWrites=true&w=majority'
    )
    const db = client.db()
    const meetupsCollection = db.collection('meetups')
    const selectedMeetup = await meetupsCollection.findOne({ _id: ObjectId(meetupId) })
    console.log(selectedMeetup)
    client.close()
    return {
        props: {
            meetupData: {
                id: selectedMeetup._id.toString(),
                title: selectedMeetup.title,
                address: selectedMeetup.address,
                description: selectedMeetup.description,
            },
        },
    }
}

export default MeetupDetails
