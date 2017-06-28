package com.example.demo.controller;

import com.example.demo.model.Message;
import com.example.demo.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.security.Principal;
import java.util.List;

@Controller
public class MainController {

    private MessageService messageService;

    @Autowired
    public MainController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping("/")
    public String signIn(Authentication user) {
        if (user != null && user.isAuthenticated()) {
            return "redirect:/chat";
        }

        return "signIn";
    }

    @GetMapping("/chat")
    public String home(Model model) {
        List<Message> messages = messageService.getAll();

        model.addAttribute("messages", messages);

        return "chat";
    }

    @MessageMapping("/speak")
    @SendTo("/topic/messages")
    public Message speak(Message message, Principal currentUser) {
        message.setAuthor(currentUser.getName());
        messageService.save(message);

        return message;
    }
}