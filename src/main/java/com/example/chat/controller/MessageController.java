package com.example.chat.controller;

import com.example.chat.model.Message;
import com.example.chat.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    
    @Autowired
    private MessageService messageService;
    
    @GetMapping("/room/{roomId}")
    public List<Message> getRoomMessages(@PathVariable String roomId) {
        return messageService.getRoomMessages(roomId);
    }
}