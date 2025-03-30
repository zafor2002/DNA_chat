package com.example.chat.service;

import com.example.chat.model.Message;
import com.example.chat.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {
    
    @Autowired
    private MessageRepository messageRepository;
    
    public Message saveMessage(Message message) {
        return messageRepository.save(message);
    }
    
    public List<Message> getRoomMessages(String roomId) {
        return messageRepository.findByRoomIdOrderByTimestampAsc(roomId);
    }
}