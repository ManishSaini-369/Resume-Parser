import { VStack } from "@chakra-ui/react"

import { useEffect, useState } from "react"
import { get_notes } from "../api/endpoints"
import FileUpload from "../components/uploadfile"
import ResumeList from "../components/getresume";
import Dashboard_Layout from "../components/dashboard_layout"

const Menu = () => {

    const [notes, setNotes] = useState([])

    useEffect(() => {
        const fetchNotes = async () => {
            const notes = await get_notes();
            setNotes(notes)
        }
        fetchNotes();
    }, [])


    return (
        <Dashboard_Layout>
        {(activeView) => (
          <VStack alignItems="start">
            {activeView === "current" ? <FileUpload /> : <ResumeList />}
          </VStack>
        )}
      </Dashboard_Layout>
    );
    
}

export default Menu;