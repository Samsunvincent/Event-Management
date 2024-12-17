import { useEffect, useState } from "react"
import AddedEvents from "../../functionalities/AddedEventsRoute"
import { useParams } from "react-router-dom"

export default function AddedEvent() {
    const {login,id,usertype} = useParams()
    const token = localStorage.getItem(login)
    const[events,setEvents] = useState([])


    useEffect(() => {
        const fetchAddedEvents = async () => {
            const fetchedData = await AddedEvents(id,token)
            setEvents(fetchedData.data)
            console.log('fetchedData',fetchedData);
        }
        fetchAddedEvents()
    },[id,login])
    return (
        <>
            <div>hello world</div>
        </>
    )
}