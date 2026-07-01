package com.sanskruti.todo_backend.controller;

import com.sanskruti.todo_backend.entity.User;
import com.sanskruti.todo_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.sanskruti.todo_backend.dto.AuthRequest;
import com.sanskruti.todo_backend.dto.AuthResponse;
import com.sanskruti.todo_backend.dto.ChangePasswordRequest;
import com.sanskruti.todo_backend.dto.ResetPasswordRequest;
import com.sanskruti.todo_backend.security.JwtUtil;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import com.sanskruti.todo_backend.dto.OtpRequest;
import com.sanskruti.todo_backend.dto.ProfileRequest;
import com.sanskruti.todo_backend.dto.ProfileResponse;
import com.sanskruti.todo_backend.dto.VerifyOtpRequest;
import com.sanskruti.todo_backend.service.EmailService;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private PasswordEncoder passwordEncoder;

        @Autowired
        private JwtUtil jwtUtil;

        @Autowired
        private EmailService emailService;

        private Map<String, String> otpStorage = new HashMap<>();

        @GetMapping("/profile/{email}")
        public ProfileResponse getProfile(
                        @PathVariable String email) {

                User user = userRepository
                                .findByEmail(email)
                                .orElseThrow();

                return new ProfileResponse(
                                user.getName(),
                                user.getEmail());
        }

        @PostMapping("/register")
        public String register(@RequestBody User user) {

                System.out.println("Name = " + user.getName());
                System.out.println("Email = " + user.getEmail());
                System.out.println("Password = " + user.getPassword());

                user.setPassword(
                                passwordEncoder.encode(user.getPassword()));

                userRepository.save(user);

                return "User Registered Successfully";
        }

        @PostMapping("/login")
        public AuthResponse login(
                        @RequestBody AuthRequest request) {

                User user = userRepository.findByEmail(
                                request.getEmail()).orElseThrow();

                boolean matched = passwordEncoder.matches(
                                request.getPassword(),
                                user.getPassword());

                if (!matched) {
                        throw new RuntimeException(
                                        "Invalid Credentials");
                }

                String token = jwtUtil.generateToken(
                                user.getEmail());

                return new AuthResponse(
                                token,
                                user.getName(),
                                user.getEmail());
        }

        @PostMapping("/send-otp")
        public String sendOtp(
                        @RequestBody OtpRequest request) {

                String otp = String.valueOf(
                                100000 +
                                                new Random().nextInt(900000));

                otpStorage.put(
                                request.getEmail(),
                                otp);

                emailService.sendOtp(
                                request.getEmail(),
                                otp);

                return "OTP Sent Successfully";
        }

        @PostMapping("/verify-otp")
        public String verifyOtp(
                        @RequestBody VerifyOtpRequest request) {

                String savedOtp = otpStorage.get(
                                request.getEmail());

                if (savedOtp == null ||
                                !savedOtp.equals(request.getOtp())) {

                        throw new RuntimeException(
                                        "Invalid OTP");
                }

                User user = userRepository.findByEmail(
                                request.getEmail())
                                .orElseThrow();

                user.setPassword(
                                passwordEncoder.encode(
                                                request.getPassword()));

                userRepository.save(user);

                otpStorage.remove(
                                request.getEmail());

                return "Password Reset Successful";
        }

        @PutMapping("/profile")
        public String updateProfile(
                        @RequestBody ProfileRequest request) {

                User user = userRepository
                                .findByEmail(
                                                request.getEmail())
                                .orElseThrow();

                user.setName(
                                request.getName());

                userRepository.save(user);

                return "Profile Updated";
        }

        @PutMapping("/change-password")
        public String changePassword(
                        @RequestBody ChangePasswordRequest request) {

                User user = userRepository
                                .findByEmail(
                                                request.getEmail())
                                .orElseThrow();

                boolean matched = passwordEncoder.matches(
                                request.getOldPassword(),
                                user.getPassword());

                if (!matched) {
                        throw new RuntimeException(
                                        "Old Password Incorrect");
                }

                user.setPassword(
                                passwordEncoder.encode(
                                                request.getNewPassword()));

                userRepository.save(user);

                return "Password Changed";
        }

        @PutMapping("/reset-password")
        public String resetPassword(
                        @RequestBody ResetPasswordRequest request) {

                User user = userRepository
                                .findByEmail(request.getEmail())
                                .orElse(null);

                if (user == null) {
                        return "Email does not exist";
                }

                user.setPassword(
                                passwordEncoder.encode(
                                                request.getPassword()));

                userRepository.save(user);

                return "Password Reset Successful";
        }
}
