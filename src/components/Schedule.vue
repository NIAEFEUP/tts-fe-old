<template>
  <div class="schedule schedule-md" v-if="!small">
    <div class="times">
      <div v-for="time in times" v-text="time"></div>
    </div><!--
 --><div class="schedule-days">
      <Column class="schedule-column" :slots="slotsPerColumn" :name="day" v-for="(day, i) in days" :key="i">
        <transition-group name="fade">
          <Lesson v-for="c in lessonsByDay[i]"
                 :key="c.id"
                 :name="c.course"
                 :className="c.composed_class_name || c.class_name"
                 :room="c.location"
                 :teacher="c.teacher_acronym"
                 :type="c.lesson_type"
                 :height="`${2 * c.duration * boxHeight}px`"
                 :top="`${(c.start_time - start) * 2 * boxHeight + 0.5}px`"
                 :time="c.time"
                 :conflicts="!!c.conflicts"></Lesson>
        </transition-group>
      </Column>
    </div>
  </div>
  <div class="schedule schedule-sm" v-else>
    <Column class="schedule-column" horizontal :slots="slotsPerColumn" :name="day" v-for="(day, i) in days" :key="i">
      <Lesson v-for="c in lessonsByDay[i]"
             horizontal
              :key="c.id"
              :name="c.course"
              :className="c.composed_class_name || c.class_name"
              :room="c.location"
              :teacher="c.teacher_acronym"
              :type="c.lesson_type"
              :height="`${2 * c.duration * boxHeight}px`"
              :top="`${(c.start_time - start) * 2 * boxHeight + 0.5}px`"
              :time="c.time"
              :conflicts="!!c.conflicts"></Lesson>
    </Column>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
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
    computed: {
      ...mapGetters({
        lessonsByDay: 'lessonsByDay',
      }),
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
    margin-top: 28px;
  }
  .times > div {
    font-size: 14px;
    line-height: 14px;
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
    transition: opacity 0.2s ease-in-out !important;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0 !important;
  }
</style>
