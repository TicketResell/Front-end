import Search from "../../layouts/components/SearchBar";
import TicketCard from "../../layouts/components/TicketCard";
import api from "../../config";
import { useEffect,useState } from "react";
import { differenceInDays, parse } from "date-fns";

function Home() {
    const [nearlyExpiredTickets,setNearlyExpiredTickets] = useState([])
    const [normalTickets,setNormalTickets] = useState([])

    //Sau khi lấy được vé từ search
    const handleSearchResults = (ticket) =>{
        ticketClassification(ticket)
    }
    //Phân loại vé 
    const ticketClassification = async(tickets) =>{
        const now = new Date()
        const nearlyExpired = []
        const normal = []

        tickets.forEach((ticket)=>{
            const expiredDate = parse(ticket.eventDate,'yyyy-MM-dd HH:mm:ss',new Date())
            const dayLeft = differenceInDays(expiredDate,now)

            if(dayLeft <= 3){
                nearlyExpired.push(ticket)
            }else{
                normal.push(ticket)
            }
        })
        setNearlyExpiredTickets(nearlyExpired)
        setNormalTickets(normal)
    }

    const fetchTickets = async () =>{
        //call api get tickets
        try {
            const response = await api.get("ticket")
            ticketClassification(response.data)
        } catch (err) {
            console.log(err)
        }
    }
    //Mỗi lần load lại trang lại lấy lại dữ liệu 1 lần
    useEffect(()=>{
        fetchTickets();
    },[])

    return (  
        <>
            <Search onSearch={handleSearchResults}/>
            
            {nearlyExpiredTickets.map((nearlyExpiredTicket)=>(
                <TicketCard key={nearlyExpiredTicket.id} ticket ={nearlyExpiredTicket}/>
            ))}
            {normalTickets.map((normalTicket)=>(
                <TicketCard key={normalTicket.id} ticket ={normalTicket}/>
            ))}
        </>
    );
}

export default Home;