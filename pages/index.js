import Head from 'next/head'
import { MongoClient } from 'mongodb'
import MeetupList from '../components/meetups/MeetupList'
import { Fragment } from 'react'

const DUMMY_MEETUPS = [
    {
        id: 'm1',
        title: 'A First MeetUp',
        image: 'https://cdn.pixabay.com/photo/2021/08/04/03/06/hanoi-6520941_960_720.jpg',
        address: 'Some address 5, 12345 Some City',
        description: 'This is a first meetup!',
    },
    {
        id: 'm2',
        title: 'A Second MeetUp',
        image: 'https://cdn.pixabay.com/photo/2021/08/04/03/06/hanoi-6520941_960_720.jpg',
        address: 'Some address 10, 12345 Some City',
        description: 'This is a second meetup!',
    },
]
const HomePage = (props) => {
    return (
        <Fragment>
            <Head>
                <title>React Meetups</title>
                <meta name="description" content="Browse a huge list of highly active React meetups!" />
            </Head>
            <MeetupList meetups={props.meetups} />
        </Fragment>
    )
}

// export async function getServerSideProps(context) {
//     const req = context.req
//     const res = context.res
//     console.log(req)
//     // fetch data from API
//     return {
//         props: {
//             meetups: DUMMY_MEETUPS,
//         },
//     }
// }

export async function getStaticProps() {
    // fetch data from an
    const client = await MongoClient.connect(
        'mongodb+srv://test:xjWQpPBWUcJtVEbu@cluster0.fj6g3.mongodb.net/meetups?retryWrites=true&w=majority'
    )
    const db = client.db()
    const meetupsCollection = db.collection('meetups')
    const meetups = await meetupsCollection.find().toArray()
    client.close()
    return {
        props: {
            meetups: meetups.map((meetup) => ({
                title: meetup.title,
                address: meetup.address,
                image: meetup.image,
                id: meetup._id.toString(),
            })),
        },
        revalidate: 1,
    }
}

export default HomePage
