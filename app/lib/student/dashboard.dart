import 'package:career_nest/student/notification_screen.dart';
import 'package:career_nest/student/profile_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import "../common/home_page.dart";
import '../common/theme.dart';
import './test_page.dart';

// Enhanced StatefulWidget for the main Dashboard page with modern UI
class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage>
    with TickerProviderStateMixin {
  // Index to track the currently selected tab in the bottom navigation bar
  int _selectedIndex = 0;

  // Animation controller for smooth transitions
  late AnimationController _animationController;

  // List of widgets to display for each tab in the bottom navigation bar
  late final List<Widget> _pages;

  // Navigation items with enhanced styling data
  final List<NavigationItem> _navItems = [
    NavigationItem(
      icon: Icons.home_rounded,
      activeIcon: Icons.home,
      label: 'Home',
    ),
    NavigationItem(
      icon: Icons.assignment_outlined,
      activeIcon: Icons.assignment,
      label: 'Tests',
    ),
    NavigationItem(
      icon: Icons.notifications_outlined,
      activeIcon: Icons.notifications,
      label: 'Notifications',
    ),
    NavigationItem(
      icon: Icons.account_circle_outlined,
      activeIcon: Icons.account_circle,
      label: 'Account',
    ),
  ];

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );
    _animationController.forward();

    // Initialize pages once to prevent recreation on tab switches
    _pages = [
      const HomePage(userName: 'Kristin'), // Home screen
      const TestsPage(), // Tests listing screen
      const NotificationsPage(), // Notifications screen
      const AccountPage(userName: 'Kristin'), // User account screen
    ];
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  // Enhanced function to update the selected index with animation
  void _onItemTapped(int index) {
    if (_selectedIndex != index) {
      // Haptic feedback for better user experience
      HapticFeedback.lightImpact();

      setState(() => _selectedIndex = index);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      body: IndexedStack(
        index: _selectedIndex,
        children: _pages,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 20,
              offset: const Offset(0, -5),
            ),
          ],
          borderRadius: const BorderRadius.only(
            topLeft: Radius.circular(25),
            topRight: Radius.circular(25),
          ),
        ),
        child: ClipRRect(
          borderRadius: const BorderRadius.only(
            topLeft: Radius.circular(25),
            topRight: Radius.circular(25),
          ),
          child: BottomNavigationBar(
            currentIndex: _selectedIndex,
            onTap: _onItemTapped,
            type: BottomNavigationBarType.fixed,
            backgroundColor: Colors.transparent,
            elevation: 0,
            selectedFontSize: AppTextScale.scaledFontSize(context, 12),
            unselectedFontSize: AppTextScale.scaledFontSize(context, 11),
            selectedLabelStyle: const TextStyle(
              fontWeight: FontWeight.w600,
              letterSpacing: 0.5,
            ),
            unselectedLabelStyle: const TextStyle(
              fontWeight: FontWeight.w500,
            ),
            items: _navItems.asMap().entries.map((entry) {
              int index = entry.key;
              NavigationItem item = entry.value;
              bool isSelected = _selectedIndex == index;

              return BottomNavigationBarItem(
                icon: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? item.color.withOpacity(0.15)
                        : Colors.transparent,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: AnimatedSwitcher(
                    duration: const Duration(milliseconds: 200),
                    child: Icon(
                      isSelected ? item.activeIcon : item.icon,
                      key: ValueKey(isSelected),
                      color: isSelected ? item.color : Colors.grey[600],
                      size: isSelected ? 26 : 24,
                    ),
                  ),
                ),
                label: item.label,
                activeIcon: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: item.color.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    item.activeIcon,
                    color: item.color,
                    size: 26,
                  ),
                ),
              );
            }).toList(),
            selectedItemColor: _navItems[_selectedIndex].color,
            unselectedItemColor: Colors.grey[600],
          ),
        ),
      ),
      // Optional: Add a floating action button for quick actions
      // floatingActionButton: _selectedIndex == 0
      //     ? FloatingActionButton(
      //         onPressed: () {
      //           // Quick action - could navigate to create new test or notification
      //           HapticFeedback.mediumImpact();
      //           ScaffoldMessenger.of(context).showSnackBar(
      //             SnackBar(
      //               content: const Text('Quick Action Pressed!'),
      //               backgroundColor: _navItems[_selectedIndex].color,
      //               behavior: SnackBarBehavior.floating,
      //               shape: RoundedRectangleBorder(
      //                 borderRadius: BorderRadius.circular(10),
      //               ),
      //             ),
      //           );
      //         },
      //         backgroundColor: _navItems[_selectedIndex].color,
      //         elevation: 8,
      //         child: const Icon(Icons.add, color: Colors.white),
      //       )
      //     : null,
      // floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
    );
  }
}

// Helper class for navigation item data
class NavigationItem {
  final IconData icon;
  final IconData activeIcon;
  final String label;
  final Color color = Colors.blue; // Default color, can be customized

  NavigationItem({
    required this.icon,
    required this.activeIcon,
    required this.label,
  });
}
