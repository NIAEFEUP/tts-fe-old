<template>
  <div class="schedule schedule-md" v-if="!small">
    <div class="times">
      <div v-for="time in times" v-text="time"></div>
    </div><!--
 --><div class="schedule-days">
      <Column class="schedule-column" :slots="slotsPerColumn" :name="day" v-for="(day, i) in days" :key="i">
        <transition-group name="fade">
          <Lesson v-for="c in lessonsByDay(i)"
                 :key="`${c.name}-${c.class}-${c.type}`"
                 :name="c.name"
                 :className="c.cclass"
                 :room="c.room"
                 :teacher="c.teacher"
                 :type="c.type"
                 :height="`${c.duration * boxHeight}px`"
                 :top="`${(c.hour - start) * 2 * boxHeight + 0.5}px`"
                 :time="c.time"></Lesson>
        </transition-group>
      </Column>
    </div>
  </div>
  <div class="schedule schedule-sm" v-else>
    <Column class="schedule-column" horizontal :slots="slotsPerColumn" :name="day" v-for="(day, i) in days" :key="i">
      <Lesson v-for="c in lessonsByDay(i)"
             horizontal
             :key="`${c.name}-${c.class}-${c.type}`"
             :name="c.name"
             :className="c.class"
             :room="c.room"
             :teacher="c.teacher"
             :type="c.type"
             :time="c.time"></Lesson>
    </Column>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  // eslint-disable-next-line import/no-webpack-loader-syntax
  import styles from '!!sass-variable-loader!../styles/variables.scss';
  import Column from './Column';
  import Lesson from './Lesson';

  export default {
    components: {
      Column,
      Lesson,
    },
    name: 'Schedule',
    data() {
      return {
        boxHeight: parseInt(styles.scheduleBoxHeight, 10),
        start: 8,
        end: 24,
        days: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
      };
    },
    mounted() {
      this.getScheduleData();
    },
    computed: {
      ...mapGetters({
        loading: 'loading',
        selectedCourses: 'selectedCourses',
      }),
      enabledLessons() {
        if (this.selectedCourses === null) return null;
        const lessons = [];
        this.selectedCourses.forEach((course) => {
          if (course.lectures && course.lectureEnabled) {
            lessons.push(...course.lectures);
          }
          if (course.selectedPractical && course.practicalEnabled) {
            lessons.push(course.selectedPractical);
          }
        });
        return lessons;
      },
      small() {
        return this.$mq.resize && !this.$mq.above(768);
      },
      slotsPerColumn() {
        return 2 * (this.end - this.start);
      },
      times() {
        return Array(this.end - this.start + 1).fill(0)
          .map((_, i) => this.start + i)
          .map(x => (x < 10 ? `0${x}:00` : `${x}:00`));
      },
      lessonsByDay() {
        const lessonsByDay = this.groupBy(this.enabledLessons, 'day');
        Object.keys(lessonsByDay).forEach((key) => {
          lessonsByDay[key].sort((a, b) => a.hour > b.hour);
        });
        return day => lessonsByDay[day + 1] || [];
      },
    },
    methods: {
      ...mapActions({
        getScheduleData: 'getScheduleData',
      }),
      groupBy(array, field) {
        const obj = {};
        if (!(array instanceof Array)) {
          return obj;
        }
        array.forEach((elem) => {
          if (obj[elem[field]] === undefined) {
            obj[elem[field]] = [];
          }
          obj[elem[field]].push(elem);
        });
        return obj;
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '../styles/variables';

  .times {
    vertical-align: top;
    width: 55px;
    display: inline-block;
    text-align: right;
    margin-top: 33px;
  }
  .times > div {
    font-size: 15px;
    font-weight: bold;
    height: 2 * $schedule-box-height;
    margin-right: 10px;
    position: relative;
  }
  .schedule {
    text-align: left;
  }
  .schedule-md {
    margin: auto;
    padding: 0 20px;
    display: flex;
    align-items: flex-start;
  }
  .schedule-days {
    display: flex;
    flex: 1;
  }
  .schedule-column {
    display: inline-block;
    position: relative;
    flex: 1;
    box-sizing: border-box;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .1s
  }
  .fade-enter, .fade-leave-to {
    opacity: 0
  }
</style>
