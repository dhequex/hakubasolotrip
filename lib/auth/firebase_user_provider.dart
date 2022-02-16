import 'package:firebase_auth/firebase_auth.dart';
import 'package:rxdart/rxdart.dart';

class HakubasolotripFirebaseUser {
  HakubasolotripFirebaseUser(this.user);
  User user;
  bool get loggedIn => user != null;
}

HakubasolotripFirebaseUser currentUser;
bool get loggedIn => currentUser?.loggedIn ?? false;
Stream<HakubasolotripFirebaseUser> hakubasolotripFirebaseUserStream() =>
    FirebaseAuth.instance
        .authStateChanges()
        .debounce((user) => user == null && !loggedIn
            ? TimerStream(true, const Duration(seconds: 1))
            : Stream.value(user))
        .map<HakubasolotripFirebaseUser>(
            (user) => currentUser = HakubasolotripFirebaseUser(user));
