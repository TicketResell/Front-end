import Search from "../../layouts/components/SearchBar";
import TicketCard from "../../layouts/components/TicketCard";
import api from "../../config";
import { useEffect,useState } from "react";
import { differenceInDays, parse } from "date-fns";
import Categories from "../../layouts/components/Categories";
import moviebackground from "../../assets/images/movie-background.jpg"
import crowd from "../../assets/images/crowd-background.jpg"
import sport from "../../assets/images/sport-background.png"

function Home() {
    const [nearlyExpiredTickets,setNearlyExpiredTickets] = useState([]);
    const [normalTickets,setNormalTickets] = useState([]);

    const categories = [
        { title: 'Concert', imgSrc: moviebackground},
        { title: 'Lễ hội', imgSrc:  moviebackground},
        { title: 'Phương tiện', imgSrc:  moviebackground},
        { title: 'Bóng đá', imgSrc:  moviebackground},
        { title: 'Hài kịch', imgSrc:  moviebackground},
        { title: 'Triển lãm', imgSrc: moviebackground },
        { title: 'Hòa nhạc', imgSrc:  moviebackground},
        { title: 'Hội chợ', imgSrc:  moviebackground},
        { title: 'Hội thảo', imgSrc: moviebackground},
        { title: 'Phim chiếu rạp', imgSrc:  moviebackground}
      ];

    const tickets = {
        price: 999.50,
        userID: 2,
        eventTitle: "Sky Tour",
        eventDate: "2024-10-01",
        categoryId: 1,
        location: "Stadium",
        ticketType: "PROMAX",
        salePrice: 890.00,
        ticketDetails: "Front row seat",
        imageUrls: [
          crowd,
          sport
        ]
      }

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
            ticketClassification(tickets)
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
            <Categories categories = {categories}/>
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