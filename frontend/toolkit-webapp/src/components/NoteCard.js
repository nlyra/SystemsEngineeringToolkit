import React, { useState } from 'react'
import { Card, CardHeader, CardContent, IconButton} from '@material-ui/core'
import { DeleteOutlined, ArrowUpwardOutlined, ArrowDownwardOutlined } from '@material-ui/icons'

export default function NoteCard({ note }){
    var cards = JSON.parse(localStorage.getItem('myCards'))
    return(
        <div>
           <Card>
                <CardHeader
                    /*upward={
                        <IconButton>
                            <ArrowUpwardOutlined/>
                        </IconButton>
                    }
                    downward={
                        <IconButton>
                            <ArrowDownwardOutlined/>
                        </IconButton>
                    }*/
                    action={
                        <IconButton>
                            <DeleteOutlined/>
                        </IconButton>
                    }
                    title= {cards}
                />
           </Card>
        </div>
    )
}