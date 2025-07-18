import 'dart:convert';
import 'dart:developer';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'quiz_model.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class QuizApiService {
  static Future<List<QuizList>> fetchQuizList() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    if (token == null) {
      throw Exception("No authentication token found");
    }
    final apiUrl = dotenv.get('API_URL');
    final response = await http.get(
      Uri.parse('$apiUrl/api/quiz'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );
    log("Response status: ${response.statusCode} , Response body: ${response.body}");
    //   print(response.body);
    if (response.statusCode == 200) {
      final List jsonData = json.decode(response.body);
      // print(jsonData);
      return jsonData.map((item) => QuizList.fromJson(item)).toList();
    } else {
      throw Exception("Failed to load quizzes: ${response.body}");
    }
  }

  static Future<bool> submitQuizAnswers({
    required int quizId,
    required List<Map<String, dynamic>> answers,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    final apiUrl = dotenv.get('API_URL');
    String userId = prefs.getString('userId') ?? '';

    final url = Uri.parse('$apiUrl/api/quiz/answers');
    final body = jsonEncode({
      'quiz_id': quizId,
      'user_id': userId,
      'answers': answers,
    });

    try {
      final response = await http.post(
        url,
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: body,
      );
      if (response.statusCode == 201) {
        return true;
      } else {
        log("Failed to submit answers: ${response.body}");
        //print(response.body);
        return false;
      }
    } catch (e) {
      log("Error submitting answers: $e");
      return false;
    }
    //return true; // Placeholder return value
  }
}
