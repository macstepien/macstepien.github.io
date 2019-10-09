---
layout: post
title: Human following robot
categories:
- Roboty
excerpt: |
 Every move you make |
 Every step you take |
 I'll follow you
  
 <img width="200" height="200" src="/pics/RosbotFollower/rosbot.jpg"> 
---

In this tutorial I describe one way to make robot detect and follow people - it won't make a great spy but could be useful to carry luggage or groceries. Whole system was implemented on Husarion's ROSbot with ESP32 as a remote. To find people I used scans from LiDAR (RPLidar A2) with my detector, which is simple but turned out to be fast and quite reliable. I also checked other LiDAR approaches available on ROS - leg_detector and leg_tracker but in this case didn't perform well enough. Another package I tested is upper_body_detector, which uses RGBD camera to detect humans. As name suggests it needs to see upper part of body - this will be a problem if we want our robot to stay close, also in this case it didn't perform very well and was slower.

{% include googleDrivePlayer.html id="1jNWkf1M97UBEypOCILnGTzXXnH618SYN/preview" %}

## Setup
### ESP32 Remote
#### Environment

You will need to follow tutorial about [setting up rosserial connection over Internet with ESP32](https://www.hackster.io/khasreto/run-rosserial-over-the-internet-with-esp32-0615f5). On ROSbot set up Husarnet connection and Rosserial for Husarnet. I recommend to set up Arduino IDE on your computer (remember to also get Rosserial for Husarnet). 

#### Code
Create new sketch in Arduino IDE and copy code:  
[ESP Remote Code](https://github.com/TheDarkPhoenix/RosbotFollowerESPRemote/blob/master/rosbot_remote.ino)

Then get your Husarnet join code and customize code as described in [ESP32 Husarnet Tutorial](https://www.hackster.io/khasreto/run-rosserial-over-the-internet-with-esp32-0615f5)

#### Wiring

Wire your ESP32 accordingly to schematics:

{% include figure.html image="/pics/RosbotFollower/remoteSchematics.png" width="600" height="800" %}

As a source of power you can use a Powerbank connected to the ESP. 

### ROSbot 
This project is meant to run on CORE2 with Mbed firmware. So be sure that you updated your firmware as described in [ROSbot quick start](https://husarion.com/tutorials/howtostart/rosbot---quick-start/). On ROSbot you will need to install following dependencies:
* **scikit-learn** python library (for clusterization)
  ``` bash
  sudo apt-get install python-scikits-learn
  ```
* **pykalman**  
  Follow installation tutorial on [pykalman page](https://pykalman.github.io/)

* **rosbot_description** package (for URDF visualization model and bridge node)  
  Go to your ROS workspace and clone repository:
  ``` bash
  cd ~/ros_workspace/src
  git clone https://github.com/husarion/rosbot_description.git
  ```
  Install dependencies:
  ``` bash
  cd ~/ros_workspace
  rosdep install --from-paths src --ignore-src -r -y
  ```
* **rosbot_ekf**  
  Install dependency: 
  ```bash
  sudo apt-get install ros-kinetic-robot-localization
  ```
  Get package:
  ```bash
  git clone https://github.com/byq77/rosbot_ekf.git
  ```

Then go back to src folder in your workspace:
``` bash
cd ~/ros_workspace/src
```

Download code:
``` bash
git clone https://github.com/TheDarkPhoenix/rosbot_follower.git
```

And finally build your workspace:
``` bash
cd ~/ros_workspace
catkin_make
```

## Usage
There are two options available: 
* followerSlow - better if you have little space and walk slowly.  
To run it you only need to copy this commande into new terminal window:
  ``` bash
  roslaunch rosbot_follower followerSlow.launch
  ```
* followerKalman - this one should be able to follow you with normal walking, but it also needs some space to gain speed.  
  Roslaunch command:
  ``` bash
  roslaunch rosbot_follower followerKalman.launch
  ```

After whole system is up and running stand in front of ROSbot, but not too far away. When you are detected blue LED on ESP should turn on. Then you can press first button (the one closer to ESP on schematics) and if you start walking robot should follow you. When LED turns off it means that algorithm lost detection of you and need to recalibrate (stand closer to robot and wait until blue LED is back on). If robot had false detection you can calibrate again by pressing second button. On RViz you can see visualization: scan from LiDAR, robot model and detections. Green spheres are all potential legs, blue cylinders are detected legs and red tall cylinder is human position. In version with Kalman filter we also publish circle around human, which shows how much estimated position differs from measurement.

{% include figure.html image="/pics/RosbotFollower/rviz.png" width="600" height="800" %}

### Troubleshooting
* **LED doesn't turn on** - check RViz if you can see detected human (red cylinder). If there is a detection then press Dead Man's Button and try to walk. 
* **ROSbot doesn't respond** - you should check your connection to ESP32. You can do so by echoing button topic:
   ``` bash
   rostopic echo /esp_remote/start
   ```
   If nothing can be seen, try restarting your ESP by turning it off and on again.

## Algorithm walkthrough

First we will go through slower version, as it is simpler. Main part of this code is scan callback where all the magic happens - data from LiDAR is analyzed and people are detected. Whole process consists of 5 steps:
1. Clusterization
2. Leg detection
3. Human detection
4. Marker publishing
5. Control

### 1. Clusterization
``` python
def scanCallback(self, scan):
    clusterList = self.findClusters(scan)
    ...
```

First we find clusters in our scan using Euclidean Clusterization Algorithm:

```python
def findClusters(self, scan):
    pointsList = np.zeros((0, 2))
    i = 0
    for r in scan.ranges:
        if r > self.minRange and r < self.maxRange:
            alfa = scan.angle_min + i * scan.angle_increment
            x = r * math.cos(alfa)
            y = r * math.sin(alfa)
            if (alfa > -math.pi and alfa < -self.maxAngle) or \
                (alfa > self.maxAngle and alfa < math.pi):
                pointsList = np.append(pointsList, [[x, y]], axis=0)
        elif r < self.minRange:
            rospy.logerr("Obstacle detected")
            return [np.zeros((1, 2))]
        i += 1
    db = DBSCAN(eps=self.clusterizationMaxDistanceParam, 
                min_samples=self.clusterizationMinSamplesParam).fit(pointsList)
    core_samples_mask = np.zeros_like(db.labels_, dtype=bool)
    core_samples_mask[db.core_sample_indices_] = True
    labels = db.labels_
    n_clusters_ = len(set(labels)) - (1 if -1 in labels else 0)
    unique_labels = set(labels)
    clusterList = []
    for k in unique_labels:
        class_member_mask = (labels == k)
        xy = pointsList[class_member_mask & core_samples_mask]
        if xy.any():
            clusterList.append(xy)
    return clusterList
```

Here we have few parameters that you can customize:
* **minRange** - used to filter ranges from lidar points, if anything gets closer than that, then ROSbot treats it as obstacle and stops
* **maxRange** - data from lidar further than that value are dismissed
* **maxAngle** - readings have to be in front of ROSbot in ranges (maxAngle, Pi) u (-Pi, -maxAngle) 
* **clusterizationMaxDistanceParam** - maximum distance between points to add new point to cluster
* **clusterizationMinSamplesParam** - minimum number of points in cluster
  
More information about [DBSCAN clusterization](https://scikit-learn.org/stable/modules/clustering.html#dbscan)

Back to scanCallback:
```python
def scanCallback(self, scan):
    ...
    if len(clusterList) == 0:
    	rospy.logwarn("No clusters detected")
    	if rospy.get_time() - self.lastDetectionTime < self.detectionTimeout:
            humanPosition = self.lastHumanPosition
            self.controlRosbot(humanPosition)
    	else:
            led = Bool()
            led.data = False
            self.ledPub.publish(led)
            self.positionCalibration = True
            rosbotControl = Twist()
            self.speedPub.publish(rosbotControl)
    	return
    elif (clusterList[0][0, 0] == 0) and (clusterList[0][0, 1] == 0):
    	led = Bool()
    	led.data = False
    	self.ledPub.publish(led)
    	self.positionCalibration = True
    	rosbotControl = Twist()
    	self.speedPub.publish(rosbotControl)
    	return
    ...
```
In here we check results of clusterization. If we didn't detect anything, we continue movement in last seen human position. That is until our last seen position is too old - then we need to stop and assume we lost track of our human, which we signal through LED.  
We pass special value when obstacle is detected - in first cluster first point is set to (0,0). In this case robot needs to stop immediately, as obstacle is too close. 

* **detectionTimeout** - how much time (in seconds) we can trust last seen position and follow it

### 2. Leg detection
Next step is leg detection:
```python
def scanCallback(self, scan):
    ...
    sortedClusters = self.detectLegs(clusterList)
    ...
```
```python 
def detectLegs(self, clusterList):
    i = 0
    sortedClusters = []
    for cluster in clusterList:
    	xMax = np.max(cluster[:, 0])
    	xMin = np.min(cluster[:, 0])
    	yMax = np.max(cluster[:, 1])
    	yMin = np.min(cluster[:, 1])
    	xDistance = xMax - xMin
    	yDistance = yMax - yMin
    	proportion = max(xDistance,yDistance)/min(xDistance, yDistance)
    	area = xDistance*yDistance
    	if not (max(xDistance,yDistance)-self.legWidth) < self.dLegWidth: 
    		continue
    	xMean = (xMax+xMin)/2
    	yMean = (yMax+yMin)/2
    	cone = Point()
    	cone.x = xMean
    	cone.y = yMean
    	cone.z = 0
    	sortedClusters.append(cone)
    sortedClusters.sort(key=lambda x: math.sqrt(x.x**2 + x.y**2))
    return sortedClusters
```

In this section we go through each cluster and calculate its bounding rectangle. Then we filter our data with following rule: longer side of rectangle can have maximal length of legWidth + dLegWidth (meaning that we assume leg width of legWidth with upper toleration dLegWidth). I encourage you to experiment with it and maybe try other conditions e.g. area and sides proportions. If cluster passes we find its centroid and save it for further calculations. As last thing we sort our potential legs by distance from ROSbot. 

* **legWidth** - width of the leg
* **dLegWidth** - toleration of leg width

```python
def scanCallback(self, scan):
    ...
    if len(sortedClusters) == 0:
    	rospy.logwarn("No legs detected")
    	if rospy.get_time() - self.lastDetectionTime < self.detectionTimeout:
            humanPosition = self.lastHumanPosition
            self.controlRosbot(humanPosition)
    	else:
            led = Bool()
            led.data = False
            self.ledPub.publish(led)
            self.positionCalibration = True
            rosbotControl = Twist()
            self.speedPub.publish(rosbotControl)
    	return
    ...
```

Similar to previous step we check results of leg detection. No legs found - we allow ROSbot to move for some time. This step is necessary to smooth out movement - sometimes in only one frame we don't detect any legs, which can cause robot to stop and go. 

### 3. Human detection
We estimate human position through analysis of legs detections:
```python
def scanCallback(self, scan):
    ...
    (firstLeg, secondLeg, humanPosition, firstLegDetected, twoLegsDetected) = self.detectHuman(sortedClusters)
    ...
```
```python
def detectHuman(self, sortedClusters):
    firstLeg = sortedClusters[0]
    firstLegDetected = False
    twoLegsDetected = False
    secondLeg = Point()
    humanPosition = Point()
    humanPositionTemp = Point()
    if len(sortedClusters) > 2:
    	sortedClusters.sort(key=lambda x: math.sqrt((x.x-firstLeg.x)**2 + (x.y-firstLeg.y)**2))
    	secondLeg = sortedClusters[1]
    	legDistance = math.sqrt((firstLeg.x - secondLeg.x)**2 + (firstLeg.y - secondLeg.y)**2)
    	if legDistance < self.legDistanceThreshold:
            humanPositionTemp.x = (firstLeg.x+secondLeg.x)/2
            humanPositionTemp.y = (firstLeg.y+secondLeg.y)/2
            humanPositionTemp.z = 0
            twoLegsDetected = True
    	else:
            humanPositionTemp = firstLeg
    else:
    	humanPositionTemp = firstLeg
    if self.positionCalibration:
    	r = math.sqrt( humanPositionTemp.x ** 2 + humanPositionTemp.y ** 2)
    	if r < self.calibrationDistance and twoLegsDetected:
            self.lastHumanPosition = humanPositionTemp
            humanPosition = humanPositionTemp
            firstLegDetected = True
            self.lastDetectionTime = rospy.get_time()
            self.positionCalibration = False
            led = Bool()
            led.data = True
            self.ledPub.publish(led)
    else:
    	distanceChange = math.sqrt((self.lastHumanPosition.x - humanPositionTemp.x)**2 \
    				+ (self.lastHumanPosition.y - humanPositionTemp.y)**2)
    	if distanceChange < self.humanPositionChangeThreshold:
            humanPosition = humanPositionTemp
            firstLegDetected = True
            self.lastHumanPosition = humanPosition
            self.lastDetectionTime = rospy.get_time()
    	else: 
            if rospy.get_time() - self.lastDetectionTime < self.detectionTimeout:
                humanPosition = self.lastHumanPosition
            else:
                led = Bool()
                led.data = False
                self.ledPub.publish(led)
                self.positionCalibration = True
    return (firstLeg, secondLeg, humanPosition, firstLegDetected, twoLegsDetected)
```

We assume our first detected leg is one closest to ROSbot. Second leg (if any available) is one closest to first leg (if it's close enough). With two legs detected we calculate possible human position as mean between legs, otherwise we use first leg as possible human position.  
When human position is not calibrated, then two legs have to be visible in range closer than given threshold. Provided that our position is already calibrated, we can check if our detected human position is viable. We calculate difference in positions between new and old detection, too big value means that it's probably false detection. In this case we check if we can use older position, otherwise we lost track of human position.

* **legDistanceThreshold** - maximum distance from first leg to second leg, if second leg distance is more than that, we use only first leg detection
* **calibrationDistance** - maximum distance from human to ROSbot to initialize position
* **humanPositionChangeThreshold** - maximum distance between last detected human position and recent human position
* **detectionTimeout** - how much time we can use old detection as human position, if we exceed this time we consider that we lost our human detection

### 4. Marker publishing
Visualization of our detections
```python
def scanCallback(self, scan):
    ...
    self.publishMarkers(firstLeg, secondLeg, humanPosition, firstLegDetected, twoLegsDetected, sortedClusters)
    ...
```

```python    
def publishMarkers(self, firstLeg, secondLeg, humanPosition, firstLegDetected, twoLegsDetected, sortedClusters):
    legMarker = Marker()
    legMarker.header.frame_id = "laser"
    legMarker.ns = "person"
    legMarker.header.stamp = rospy.Time()
    legMarker.type = Marker.CYLINDER
    legMarker.action = Marker.ADD
    legMarker.pose.orientation.x = 0.0
    legMarker.pose.orientation.y = 0.0
    legMarker.pose.orientation.z = 0.0
    legMarker.pose.orientation.w = 1.0
    legMarker.scale.x = 0.04
    legMarker.scale.y = 0.04
    legMarker.scale.z = 0.04
    legMarker.color.a = 1.0
    legMarker.color.r = 0.0
    legMarker.color.g = 0.0
    legMarker.color.b = 1.0
    legMarker.lifetime = rospy.Duration(0.5)
    if not self.positionCalibration:
    	#first leg
        if firstLegDetected:
            legMarker.id = 1
            legMarker.pose.position = firstLeg
            legMarker.pose.position.z = 0.02
            self.legPub.publish(legMarker)
        #second leg
        if twoLegsDetected:
            legMarker.id = 2
            legMarker.pose.position = secondLeg
            self.legPub.publish(legMarker)
    	#human position
    	legMarker.id = 3
    	legMarker.scale.z = 0.2
    	legMarker.pose.position = humanPosition
    	legMarker.pose.position.z = 0.1
    	legMarker.color.r = 1.0
    	legMarker.color.b = 0.0
    	self.legPub.publish(legMarker)
    legMarker = Marker()
    legMarker.ns = "legs"
    legMarker.header.frame_id = "laser"
    legMarker.header.stamp = rospy.Time()
    legMarker.type = Marker.SPHERE
    legMarker.action = Marker.ADD
    legMarker.pose.orientation.x = 0.0
    legMarker.pose.orientation.y = 0.0
    legMarker.pose.orientation.z = 0.0
    legMarker.pose.orientation.w = 1.0
    legMarker.scale.x = 0.04
    legMarker.scale.y = 0.04
    legMarker.scale.z = 0.04
    legMarker.color.a = 1.0
    legMarker.color.r = 0.0
    legMarker.color.g = 1.0
    legMarker.color.b = 0.0
    legMarker.lifetime = rospy.Duration(0.2)
    i = 1
    for x in sortedClusters:
    	legMarker.id = i
    	i += 1
    	legMarker.pose.position.x = x.x
    	legMarker.pose.position.y = x.y
    	self.legPub.publish(legMarker)
```
Pretty straightforward: we publish markers with potential legs (green spheres), detected legs (if any found, blue cylinders) and human (red cylinder).

### 5. Control
And final step is movement control:
```python
def scanCallback(self, scan):
    ...
    self.controlRosbot(humanPosition)
```
```python
def controlRosbot(self, humanPosition):
    r = math.sqrt( humanPosition.x ** 2 + humanPosition.y ** 2)
    a = math.atan2(humanPosition.y, -humanPosition.x)
    if r > self.minHumanDistance:
    	xSpeed = -r * self.speedPGain
    else:
    	xSpeed = 0
    if abs(a) > self.minHumanAngle:
    	zAngularSpeed = a * self.angularSpeedPGain
    else:
    	zAngularSpeed = 0
    rosbotControl = Twist()
    if rospy.get_time() - self.buttonTime < self.buttonTimeout and \
    		self.buttonState == True and not self.positionCalibration:
    	rosbotControl.linear.x = xSpeed
    	rosbotControl.angular.z = zAngularSpeed
    	self.speedPub.publish(rosbotControl)
    else:
    	self.speedPub.publish(rosbotControl)
```
Firstly we convert our cartesian coordinates to polar ones. Then we calculate angular and linear speed for ROSbot with proportional controller. We publish it if we receive message from remote that allow robot to move.

* **minHumanDistance** - if human distance is more than that robot will start following
* **minHumanAngle** - if human angle is more than that robot will start following
* **speedPGain** - proportional gain for linear ROSbot speed (increase if you want your robot to go faster)
* **angularSpeedPGain** - proportional gain for angular ROSbot speed (increase if you want your robot to turn faster)
* **buttonTimeout** (seconds) - if we don’t receive new Dead Man’s Button message for that time ROSbot isn’t allowed to move

### FollowerKalman
 This version is improved slow follower - basically only additions are scoring system and Kalman filter. Also I changed some parameters to make it more suitable for higher speeds.  
In order to implement Kalman filter I created Person class,  where human position is stored and updated. For Kalman Filter part I used code from [leg_tracker](https://github.com/angusleigh/leg_tracker). All the parameters for filter where well tuned, I only changed std_obs value. 
* **std_obs** - increasing this value means you don't trust your measurements and as the effect your data is much more filtered. Be careful with changing it too much, because it causes your estimated human position to be slower to sudden changes - if you stop, filter won't trust as much your readings and as a result it will predict you will still move with some velocity. Consequently robot will continue moving forward and it will take some time to adjust to reality. On the other hand if you decrease it too much human position will fluctuate with uncertainties in leg detections.

Next big change is that I added scoring system which uses all parameters: proportion, area, length and distance. It combines it with appropriate weights.
``` python
proportion = max(xDistance,yDistance)/min(xDistance, yDistance)
area = xDistance*yDistance
widthDifference = (max(xDistance,yDistance)-self.legWidth) - self.dLegWidth
distanceFromRobot = math.sqrt(xMean**2 + yMean**2)
score = 0
score += distanceFromRobot * self.distanceWeight
score += abs(proportion - self.destProportion) * self.proportionWeight
score += abs(area - self.destArea) * self.areaWeight
if widthDifference > 0:
    score += (abs(widthDifference) * self.widthDifferenceWeight)**2
if score < self.maxScore:
    sortedClustersDetails.append([xMean, yMean, distanceFromRobot, proportion, area, widthDifference, score])
```
Parameters:
* **destProportion** - our desired proportion, I set it based on readings I got
* **destArea** - same as above but with area
* **distanceWeight** - weight we give to distance from robot
* **proportionWeight** - weight we set to distance between measured proportion and desired
* **areaWeight** - don't set this weight too high, as it is not as reliable
* **widthDifferenceWeight** - we set it really high, because when reading is too long, then it's probably not a leg 
* **maxScore** - above that score we are certain that detection isn't a leg


Parameters with updated values:
* **minRange** (increased) - robot has to detect obstacles earlier
* **speedPGain** (increased) - increase in proportional gain to obtain higher speed
* **angularSpeedPGain** (increased) - same as above
* **minHumanDistance** (decreased) - robot will start following earlier and be able to keep up with human
* **humanPositionChangeThreshold** (increased) - person walks faster so position can change more
* **detectionTimeout** (decreased) - higher speeds, so we decrease timeouts
* **buttonTimeout** (decreased) - same as above
  
Lastly I added restrictions on obstacle detect - we only detect obstacle approximately in area where we can drive. Increasing minRange can cause ROSbot to be unable to move in narrow spaces.
``` python
if (alfa > -math.pi and alfa < -self.maxAngle) or \
	(alfa > self.maxAngle and alfa < math.pi):
```

## Summary
In this tutorial you learned how to set up and run human following using ROSbot with ESP remote. After main algorithm walkthrough you should be also able to modify it to suit your robot.